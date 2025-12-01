import { BadRequestError, ConflictError, NotFoundError } from "../errors";
import { Prisma } from "../generated/prisma";

/**
 * Convert the error Prisma in custom errors
 * @param error The error object
 */
export const handlePrismaError = (error: unknown): never => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 - Unique constraint violation
    if (error.code === "P2002") {
      const target = (error.meta?.target as string[]) || [];
      throw new ConflictError(
        `A record with this ${target.join(", ")} already exists`
      );
    }

    // P2025 - Record not found
    if (error.code === "P2025") {
      throw new NotFoundError("Record not found");
    }

    // P2003 - Foreign key constraint
    if (error.code === "P2003") {
      throw new BadRequestError("Invalid relation or foreign key constraint");
    }

    // P2014 - Relation violation
    if (error.code === "P2014") {
      throw new BadRequestError(
        "Cannot delete record due to existing relations"
      );
    }
  }

  throw error;
};
