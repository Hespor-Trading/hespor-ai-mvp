"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  title: string;
  description?: string;
  connected: boolean;
  actionHref: string;
  actionLabel: string;
  disabled?: boolean;
};

export default function ConnectStep({ title, description, connected, actionHref, actionLabel, disabled }: Props) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <Badge variant={connected ? "success" as any : "default"} className={connected ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700"}>
          {connected ? "Connected" : "Not connected"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {description && <p className="text-sm text-gray-600">{description}</p>}
        <Button asChild disabled={disabled || connected} className="bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
          <a href={connected ? "#" : actionHref}>{connected ? "Connected" : actionLabel}</a>
        </Button>
      </CardContent>
    </Card>
  );
}
