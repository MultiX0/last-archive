/**
 * Search Client
 * Handles streaming search and stats fetching
 */

export interface Session {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface HistoryMessage {
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
    sources?: {
        count: number;
        searchTimeMs: number;
        items: SourceItem[];
    };
}

export interface SessionDetail {
    session: Session;
    history: HistoryMessage[];
}

export interface SourceItem {
    type: 'page' | 'pdf';
    url: string;
    title: string;
    score: number;
}

export interface SourcesPayload {
    count: number;
    items: SourceItem[];
    searchTimeMs: number;
}

export interface DonePayload {
    totalTimeMs: number;
}

export interface StatsData {
    entries: { value: string; raw: number; label: string };
    pages: { value: string; raw: number; label: string };
    pdfs: { value: string; raw: number; label: string };
    available: { value: string; label: string };
}

export interface SearchCallbacks {
    onStatus?: (status: string) => void;
    onSources?: (sources: SourcesPayload) => void;
    onToken?: (token: string) => void;
    onSession?: (sessionId: string) => void;
    onDone?: (data: DonePayload) => void;
    onError?: (error: string) => void;
}

/**
 * Perform a streaming search query
 */
export async function searchStream(
    query: string,
    callbacks: SearchCallbacks,
    sessionId?: string | null,
    signal?: AbortSignal
): Promise<void> {
    const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query,
            ...(sessionId ? { sessionId } : {})
        }),
        signal,
    });

    if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split('\n\n');
            buffer = parts.pop() || '';

            for (const part of parts) {
                const lines = part.split('\n');
                let eventType: string | null = null;
                let eventData: string | null = null;

                for (const line of lines) {
                    if (line.startsWith('event: ')) {
                        eventType = line.slice(7).trim();
                    } else if (line.startsWith('data: ')) {
                        eventData = line.slice(6);
                    }
                }

                if (eventType && eventData !== null) {
                    switch (eventType) {
                        case 'status':
                            callbacks.onStatus?.(eventData);
                            break;
                        case 'session':
                            callbacks.onSession?.(eventData);
                            break;
                        case 'sources':
                            callbacks.onSources?.(JSON.parse(eventData));
                            break;
                        case 'token':
                            callbacks.onToken?.(eventData);
                            break;
                        case 'done':
                            callbacks.onDone?.(JSON.parse(eventData));
                            break;
                        case 'error':
                            callbacks.onError?.(eventData);
                            break;
                    }
                }
            }
        }
    } finally {
        reader.releaseLock();
    }
}

/**
 * Fetch database stats
 */
export async function fetchStats(): Promise<StatsData | null> {
    try {
        const response = await fetch('/api/stats');
        const result = await response.json();
        if (result.success) {
            return result.data as StatsData;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Check service health
 */
export async function checkHealth(): Promise<boolean> {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        return data.status === 'healthy';
    } catch {
        return false;
    }
}

/**
 * Get all sessions
 */
export async function getSessions(): Promise<Session[]> {
    const res = await fetch('/api/sessions');
    const data = await res.json();
    if (data.success) return data.sessions;
    return [];
}

/**
 * Get session details and history
 */
export async function getSession(id: string): Promise<SessionDetail | null> {
    const res = await fetch(`/api/sessions/${id}`);
    const data = await res.json();
    if (data.success) return { session: data.session, history: data.history };
    return null;
}

/**
 * Rename session
 */
export async function renameSession(id: string, title: string): Promise<boolean> {
    const res = await fetch(`/api/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
    });
    const data = await res.json();
    return data.success;
}

/**
 * Delete session
 */
export async function deleteSession(id: string): Promise<boolean> {
    const res = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE',
    });
    const data = await res.json();
    return data.success;
}
