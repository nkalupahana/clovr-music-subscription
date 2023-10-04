import { fetcher } from "@/lib/swr";
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

    return <>
        <h1>Subscriptions</h1>
        { status === "authenticated" && <p>Subscribed: { String(session?.user?.subscribed) }</p> }
        { session?.user.subscribed && stripeStatus && <>
            <p>Subscription Status: { stripeStatus.status }</p>
            <p>Quantity: { stripeStatus.quantity }</p>
        </> }
        { !session?.user.subscribed && <button className="btn btn-primary" onClick={subscribe}>
            Subscribe
        </button> }
        <br />
        <button className="btn btn-primary" onClick={() => update()}>
            Update
        </button>
    </>;
} 