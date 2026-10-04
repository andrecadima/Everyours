import "dotenv/config";
import { Client } from "pg";

/** Direct read of persisted leads, to prove the form really writes to Postgres. */
export async function findLeadByEmail(email: string) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const { rows } = await client.query(
      `select l.*, p.slug from "Lead" l join "Property" p on p."id" = l."propertyId" where l.email = $1`,
      [email],
    );
    return rows;
  } finally {
    await client.end();
  }
}

export async function deleteLeadsByEmail(email: string) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(`delete from "Lead" where email = $1`, [email]);
  } finally {
    await client.end();
  }
}
