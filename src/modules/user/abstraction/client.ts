import { AxiosClient, AxiosModuleNames, AxiosState } from "@/modules/axios";
import { inject, injectable } from "inversify";

type FindOneParams = {
  endpoint: string;
};
type FindAllParams = {
  endpoint: string;
};

type sharedUpdateParams = {
  fullName?: string;
  city?: string;
  phoneNumber?: string;
  profileMetadata?: string;
  endpoint: string;
};
type sharedCreateParams = {
  email: string;
  password: string;
  fullName: string;
  city: string;
  phoneNumber: string;
  roles: string[];
  profileMetadata: string;
  endpoint: string;
};
type SharedRolesParams = {
  endpoint: string;
  roles: string[];
};
type SharedPermissionsParams = {
  endpoint: string;
  permissions: string[];
};
type SharedDeleteParams = {
  endpoint: string;
};

type ChangePasswordParams = {
  endpoint: string;
  currentPassword: string;
  newPassword: string;
};

@injectable()
abstract class Client<T extends AxiosState> {
  @inject(AxiosModuleNames.client) protected axiosClient: AxiosClient<T>;

  protected sharedFindAll(params: FindAllParams) {
    const { endpoint } = params;
    const res = this.axiosClient.get({ endpoint: endpoint });
    return res;
  }

  protected sharedCreate(params: sharedCreateParams) {
    const { endpoint, ...body } = params;
    const res = this.axiosClient.post({ endpoint: endpoint }).setBody(body);
    return res;
  }
  protected sharedFindOne(params: FindOneParams) {
    const { endpoint } = params;
    const res = this.axiosClient.get({
      endpoint: endpoint,
    });
    return res;
  }

  protected sharedUpdate(params: sharedUpdateParams) {
    const { endpoint, ...body } = params;
    const res = this.axiosClient.put({ endpoint: endpoint }).setBody(body);
    return res;
  }

  protected sharedDelete(params: SharedDeleteParams) {
    const { endpoint } = params;
    const res = this.axiosClient.delete({ endpoint: endpoint });
    return res;
  }

  protected sharedActivate(params: SharedDeleteParams) {
    const { endpoint } = params;
    const res = this.axiosClient.post({ endpoint: endpoint });
    return res;
  }

  protected sharedDeactivate(params: SharedDeleteParams) {
    const { endpoint } = params;
    const res = this.axiosClient.post({ endpoint: endpoint });
    return res;
  }

  protected sharedAssignRoles(params: SharedRolesParams) {
    const { endpoint, ...body } = params;
    const res = this.axiosClient.post({ endpoint: endpoint }).setBody(body);
    return res;
  }

  protected sharedRemoveRoles(params: SharedRolesParams) {
    const { endpoint, ...body } = params;
    const res = this.axiosClient.delete({ endpoint: endpoint }).setBody(body);
    return res;
  }

  protected sharedGetPermissions(params: SharedDeleteParams) {
    const { endpoint } = params;
    const res = this.axiosClient.get({ endpoint: endpoint });
    return res;
  }

  protected sharedAssignPermissions(params: SharedPermissionsParams) {
    const { endpoint, ...body } = params;
    const res = this.axiosClient.post({ endpoint: endpoint }).setBody(body);
    return res;
  }

  protected sharedReplacePermissions(params: SharedPermissionsParams) {
    const { endpoint, ...body } = params;
    const res = this.axiosClient.put({ endpoint: endpoint }).setBody(body);
    return res;
  }

  protected sharedRemovePermission(params: SharedDeleteParams) {
    const { endpoint } = params;
    const res = this.axiosClient.delete({ endpoint: endpoint });
    return res;
  }

  protected sharedChangePassword(params: ChangePasswordParams) {
    const { endpoint, ...body } = params;
    const res = this.axiosClient.post({ endpoint: endpoint }).setBody(body);

    return res;
  }
}
export { Client as UserClient };
