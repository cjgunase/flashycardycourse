"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, Database, Bot } from "lucide-react";

interface HealthData {
    status: "healthy" | "degraded" | "down";
    timestamp: string;
    services: {
        database: {
            status: "operational" | "down" | "unknown";
            latency: number;
            message?: string;
        };
        openai: {
            status: "operational" | "down" | "unknown";
            latency: number;
            message?: string;
        };
    };
}

export default function StatusPage() {
    const [data, setData] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHealth = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/health");
            const json = await res.json();
            setData(json);
            setError(null);
        } catch (err) {
            setError("Failed to fetch status");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        // Poll every 30 seconds
        const interval = setInterval(fetchHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "healthy":
            case "operational":
                return "bg-green-500 hover:bg-green-600";
            case "degraded":
                return "bg-yellow-500 hover:bg-yellow-600";
            case "down":
                return "bg-red-500 hover:bg-red-600";
            default:
                return "bg-gray-500 hover:bg-gray-600";
        }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        if (status === "operational" || status === "healthy") {
            return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        }
        return <XCircle className="h-5 w-5 text-red-500" />;
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
                        <p className="text-muted-foreground mt-2">
                            Current status of system components and services.
                        </p>
                    </div>
                    {data && (
                        <Badge
                            className={`${getStatusColor(
                                data.status
                            )} text-white px-4 py-1 text-sm capitalize`}
                        >
                            {data.status}
                        </Badge>
                    )}
                </div>

                {loading && !data ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
                        <CardContent className="pt-6 text-red-600 dark:text-red-400">
                            {error}
                        </CardContent>
                    </Card>
                ) : data ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Database Status */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Database</CardTitle>
                                <Database className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2">
                                    <StatusIcon status={data.services.database.status} />
                                    <div className="text-2xl font-bold capitalize">
                                        {data.services.database.status}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Latency: {data.services.database.latency}ms
                                </p>
                                {data.services.database.message && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {data.services.database.message}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* OpenAI Status */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">OpenAI API</CardTitle>
                                <Bot className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2">
                                    <StatusIcon status={data.services.openai.status} />
                                    <div className="text-2xl font-bold capitalize">
                                        {data.services.openai.status}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Latency: {data.services.openai.latency}ms
                                </p>
                                {data.services.openai.message && (
                                    <p className="text-xs text-red-500 mt-1">
                                        {data.services.openai.message}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : null}

                <div className="text-center text-sm text-muted-foreground">
                    Last updated: {data ? new Date(data.timestamp).toLocaleString() : "-"}
                </div>
            </div>
        </div>
    );
}
