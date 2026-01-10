export function BackgroundVideo() {
    return (
        <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
            {/* Simple, elegant gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b0d12] via-[#0f1218] to-[#0a0c10]" />

            {/* Soft spotlight glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_35%,transparent_60%)]" />

            {/* Gentle vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
        </div>
    );
}
