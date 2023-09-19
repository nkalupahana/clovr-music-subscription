import { useSession, signIn, signOut } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/swr";
import { MusicFile } from "@/models/MusicFile";
import { useRef, useState } from "react";

export default function Index() {
    const { data: session, status } = useSession();
    const { data: musicList } = useSWR("/api/music/list", fetcher);
    const audio = useRef<HTMLAudioElement>(null);

    return (
        <>
            { status === "loading" && <p>Hang on there...</p> }
            { status === "unauthenticated" && <>
                <p>Not signed in.</p> 
                <button onClick={() => signIn("google")}>Sign in with Google</button>
            </> }
            { status === "authenticated" && <>
                <p>Signed in as { session?.user?.email }</p>
                <p>Is Admin: { String(session?.user?.isAdmin) }</p>
                <p>Subscribed: { String(session?.user?.subscribed) }</p>
                <button onClick={() => signOut()}>Sign out</button>
            </> }
            <table>
                <thead>
                    <tr>
                        <td>Song Name</td>
                        <td>Tempo</td>
                        <td>Play</td>
                        <td>Download</td>
                    </tr>
                </thead>
                { musicList?.map((music: MusicFile) => <tr key={music._id}>
                    <td>{ music.name }</td>
                    <td>{ music.tempo }</td>
                    <td onClick={() => {
                        audio.current!.src = `/api/music/play?id=${music._id}`; 
                        audio.current!.play();
                    }}>Play</td>
                    <td onClick={() => {
                        window.open(`/api/music/download?id=${music._id}`)
                    }}>Download</td>
                </tr>) }
            </table>
            <audio ref={audio}></audio>
            <br /><br />
            <p>Upload Music</p>
            <form method="POST" action="/api/music/upload" encType="multipart/form-data">
                <input type="text" name="songname" placeholder="Song Name" required /><br />
                <input type="number" name="tempo" placeholder="Tempo" required /><br />
                <input type="file" name="file" accept="audio/mpeg" required /><br />
                <input type="submit" value="Upload" />
            </form>
        </>
    );
}
