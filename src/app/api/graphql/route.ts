import { NextResponse } from "next/server";
import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT = process.env.CWA_GRAPHQL_ENDPOINT;
const AUTHORIZATION = process.env.CWA_KEY;

export async function POST(req: Request) {
  try {
    const { query, variables } = await req.json();

    const client = new GraphQLClient(GRAPHQL_ENDPOINT ?? "", {
      headers: {
        Authorization: AUTHORIZATION ?? "",
        "Content-Type": "application/json",
      },
    });
    const data = await client.request(query, variables);
    return NextResponse.json({data});
  } catch (error) {
    console.error("GraphQL Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
