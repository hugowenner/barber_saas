import type { AdminUser } from "@/types/admin";

/**
 * Mock admin user. In the future, this comes from the `Admin` Prisma model
 * via NextAuth credentials provider.
 */
export const MOCK_ADMIN_USER: AdminUser = {
  id: "admin-1",
  name: "Administrador",
  email: "admin@barberhouse.com.br",
  role: "ADMIN",
  barbershopId: "barbershop-1",
};
