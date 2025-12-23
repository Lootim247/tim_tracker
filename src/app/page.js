import Link from "next/link";

export default function HomePage() {
    return (
        <div>
            <h1>Welcome to Tim Tracker!</h1>
            <p>Allows tracking of your day for loved ones abroad or away!</p>
            <ul>
                <li>Share your location with another user so they can see your day!</li>
                <li>Share photos along your timeline</li>
                <li>Choose when and how to show location</li>
            </ul>
            <p>Create an account or login to get started!</p>
            <Link href="/enter">/login</Link>
        </div>
    );
}