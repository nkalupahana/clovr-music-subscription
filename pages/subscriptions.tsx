import { fetcher } from "@/lib/swr";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import useSWR from "swr";

export default function Subscriptions() {
    const { data: session, status, update } = useSession();
    const { data: stripeStatus } = useSWR("/api/stripe/status", fetcher);

    useEffect(() => {
        const url = new URL(window.location.href);
        const upd = url.searchParams.get("update");
        if (upd?.trim() === "true") {
            update();
        }
    }, []);

    const subscribe = useCallback(() => {
        window.location.href = "/api/stripe/subscribe";
    }, []);

    const manage = useCallback((op: string) => {
        window.location.href = "/api/stripe/manage?op=" + op;
    }, []);

    return <>
        <h1>Subscriptions</h1>
        { status === "authenticated" && <p>Subscribed: { String(session?.user?.subscribed) }</p> }
        { session?.user.subscribed && stripeStatus && <>
            <p>Subscription Status: { stripeStatus.status }</p>
            <p>Max Channels: { stripeStatus.quantity }</p>
        </> }
        { !session?.user.subscribed && <button className="btn btn-primary" onClick={subscribe}>
            Subscribe
        </button> }
        { session?.user.subscribed && stripeStatus && <>
            <Button onClick={() => manage("payment_method_update")}>Change Payment Method</Button>
            <Button onClick={() => manage("subscription_update")}>Add/Remove Channels</Button>
            { !stripeStatus.cancelAt && <Button onClick={() => manage("subscription_cancel")}>Cancel Subscription</Button> }
            { stripeStatus.cancelAt && <Button onClick={() => manage("uncancel")}>Uncancel Subscription</Button> }
        </> }
        <br />
        <button className="btn btn-primary" onClick={() => update()}>
            Update
        </button>
    </>;
} 