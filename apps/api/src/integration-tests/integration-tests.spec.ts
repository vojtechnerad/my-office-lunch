import { testClient } from 'hono/testing';
import { describe } from 'vitest';
import app from '../app';
import { db } from 'database';
import { DbSchema } from 'database';
import { eq } from 'drizzle-orm';
import { LoginResponse } from 'contracts/auth.contracts';

const client = testClient(app);

describe('User that is not group admin is unable to update group', () => {
  const adminUserDetails = {
    email: 'admin@example.com',
    password: 'password',
    name: 'Admin User',
  };
  const nonAdminUserDetails = {
    email: 'user@example.com',
    password: 'password',
    name: 'Non-Admin User',
  };

  let adminUserToken = '';
  let nonAdminUserToken = '';

  it('create group admin user', async () => {
    const response = await client.register.$post({
      json: {
        email: adminUserDetails.email,
        password: adminUserDetails.password,
        name: adminUserDetails.name,
      },
    });

    expect(response.status).toBe(201);
  });

  it('create non-group admin user', async () => {
    const response = await client.register.$post({
      json: {
        email: nonAdminUserDetails.email,
        password: nonAdminUserDetails.password,
        name: nonAdminUserDetails.name,
      },
    });

    expect(response.status).toBe(201);
  });

  it('login as both admin and non-admin user', async () => {
    const adminLoginResponse = await client.login.$post({
      json: {
        email: adminUserDetails.email,
        password: adminUserDetails.password,
      },
    });
    const nonAdminLoginResponse = await client.login.$post({
      json: {
        email: nonAdminUserDetails.email,
        password: nonAdminUserDetails.password,
      },
    });

    expect(adminLoginResponse.status).toBe(200);
    expect(nonAdminLoginResponse.status).toBe(200);

    const adminLoginResult = (await adminLoginResponse.json()) as LoginResponse;
    const nonAdminLoginResult =
      (await nonAdminLoginResponse.json()) as LoginResponse;

    adminUserToken = adminLoginResult.token;
    nonAdminUserToken = nonAdminLoginResult.token;
  });

  it('create group with admin user', async () => {
    const adminCreateGroupResponse = await client.groups.$post(
      {
        json: {
          name: 'Test Group',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${adminUserToken}`,
        },
      },
    );

    expect(adminCreateGroupResponse.status).toBe(201);
  });

  it('non-admin user tries to update group and gets 403 response', async () => {
    const [group] = await db
      .select()
      .from(DbSchema.groups)
      .where(eq(DbSchema.groups.name, 'Test Group'))
      .limit(1);

    const nonAdminUpdateGroupResponse = await client.groups[':groupId'].$patch(
      {
        json: {
          name: 'Updated Group Name',
        },
        param: {
          groupId: group.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${nonAdminUserToken}`,
        },
      },
    );

    expect(nonAdminUpdateGroupResponse.status).toBe(403);
  });

  it('admin user updates group successfully', async () => {
    const [group] = await db
      .select()
      .from(DbSchema.groups)
      .where(eq(DbSchema.groups.name, 'Test Group'))
      .limit(1);

    const adminUpdateGroupResponse = await client.groups[':groupId'].$patch(
      {
        json: {
          name: 'Updated Group Name',
        },
        param: {
          groupId: group.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${adminUserToken}`,
        },
      },
    );

    expect(adminUpdateGroupResponse.status).toBe(200);
  });
});
