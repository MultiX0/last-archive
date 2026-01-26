import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge" // Use Edge Runtime for best streaming performance

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const backendUrl = process.env.BACKEND_URL || "http://localhost:1213"

        const response = await fetch(`${backendUrl}/api/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            return NextResponse.json({ error: `Backend error: ${response.statusText}` }, { status: response.status })
        }

        // Pass the stream directly to the client
        return new NextResponse(response.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        })
    } catch (error) {
        console.error("Search API Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
