import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params
    return proxyRequest(req, path)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params
    return proxyRequest(req, path)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params
    return proxyRequest(req, path)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params
    return proxyRequest(req, path)
}

async function proxyRequest(req: NextRequest, path: string[]) {
    try {
        const backendUrl = process.env.BACKEND_URL || "http://localhost:1213"
        const targetPath = path.join("/")
        const url = new URL(`${backendUrl}/api/${targetPath}`)

        // Forward query parameters
        req.nextUrl.searchParams.forEach((value, key) => {
            url.searchParams.set(key, value)
        })

        const headers = new Headers(req.headers)
        headers.delete("host") // Let fetch set the host

        const options: RequestInit = {
            method: req.method,
            headers: headers,
            // Only set body for methods that allow it
            body: ["POST", "PATCH", "PUT"].includes(req.method) ? await req.blob() : null,
            redirect: "follow",
        }

        const response = await fetch(url.toString(), options)
        const data = await response.blob()

        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        })
    } catch (error) {
        console.error("Proxy Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
