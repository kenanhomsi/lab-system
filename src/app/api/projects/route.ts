import { NextRequest, NextResponse } from "next/server";
import { backendContainer } from "@/container/backend";
import {
  PROJECTS_BACKEND_SERVICE,
  type ProjectCreateInput,
} from "@/modules/projects";
import { ProjectsBackendService } from "@/modules/projects/backend/service";
import { extractBearerToken, jsonError } from "@/lib/api/bff-errors";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import { mockProjectsCreate, mockProjectsFind } from "@/lib/api/projects-mock-store";

export async function GET(request: NextRequest) {
  try {
    if (!isUpstreamBackendReady()) {
      return NextResponse.json(mockProjectsFind());
    }
    const token = extractBearerToken(request.headers.get("authorization"));
    const service = backendContainer.get<ProjectsBackendService>(
      PROJECTS_BACKEND_SERVICE,
    );
    const search = request.nextUrl.searchParams;
    const params: Record<string, string | undefined> = {};
    search.forEach((value, key) => {
      params[key] = value;
    });
    const data = await service.Find(token, params);
    return NextResponse.json(data);
  } catch (error: unknown) {
    return jsonError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProjectCreateInput;
    if (!isUpstreamBackendReady()) {
      const created = mockProjectsCreate(body);
      return NextResponse.json(created, { status: 201 });
    }
    const token = extractBearerToken(request.headers.get("authorization"));
    const service = backendContainer.get<ProjectsBackendService>(
      PROJECTS_BACKEND_SERVICE,
    );
    const data = await service.Create(token, body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    return jsonError(error);
  }
}
