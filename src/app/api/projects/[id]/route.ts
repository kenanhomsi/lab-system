import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container/backend";
import {
  PROJECTS_BACKEND_SERVICE,
  type ProjectUpdateInput,
} from "@/modules/projects";
import { ProjectsBackendService } from "@/modules/projects/backend/service";
import { extractBearerToken, jsonError } from "@/lib/api/bff-errors";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import {
  mockProjectsDelete,
  mockProjectsFindOne,
  mockProjectsUpdate,
} from "@/lib/api/projects-mock-store";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!isUpstreamBackendReady()) {
      const row = mockProjectsFindOne(id);
      if (!row) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(row);
    }
    const token = extractBearerToken(request.headers.get("authorization"));
    const service = backendContainer.get<ProjectsBackendService>(
      PROJECTS_BACKEND_SERVICE,
    );
    const data = await service.FindOne(token, id);
    return NextResponse.json(data);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as ProjectUpdateInput;
    if (!isUpstreamBackendReady()) {
      const row = mockProjectsUpdate(id, body);
      if (!row) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(row);
    }
    const token = extractBearerToken(request.headers.get("authorization"));
    const service = backendContainer.get<ProjectsBackendService>(
      PROJECTS_BACKEND_SERVICE,
    );
    const data = await service.Update(token, id, body);
    return NextResponse.json(data);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!isUpstreamBackendReady()) {
      const ok = mockProjectsDelete(id);
      if (!ok) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return new NextResponse(null, { status: 204 });
    }
    const token = extractBearerToken(request.headers.get("authorization"));
    const service = backendContainer.get<ProjectsBackendService>(
      PROJECTS_BACKEND_SERVICE,
    );
    await service.Delete(token, id);
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return jsonError(error);
  }
}
