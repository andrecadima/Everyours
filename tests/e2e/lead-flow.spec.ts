import { expect, test } from "@playwright/test";
import { deleteLeadsByEmail, findLeadByEmail } from "./db";

const email = `e2e+${Date.now()}@example.com`;
