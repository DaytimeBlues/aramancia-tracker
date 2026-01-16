import { useState } from 'react';
import { Feather, Shield, Brain, User, Settings, Skull, Wand2, Backpack } from 'lucide-react'; // Added Backpack, Removed X
import { BackgroundVideo } from './BackgroundVideo';
import { useAppSelector } from '../../store/hooks';
import { selectCharacter } from '../../store/slices/characterSlice';
import { selectAllMinions } from '../../store/slices/combatSlice';
import { MinionDrawer } from '../minions/MinionDrawer';
import { WandDrawer } from '../widgets/WandDrawer';

interface AppShellProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const navItems = [
    { id: 'home', icon: Shield, label: 'Stats' },
    { id: 'spells', icon: Wand2, label: 'Spellbook' },
    { id: 'combat', icon: Skull, label: 'Combat' },
    { id: 'abilities', icon: Brain, label: 'Abilities' },
    { id: 'bio', icon: User, label: 'Bio' },
    { id: 'inventory', icon: Backpack, label: 'Inventory' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

export function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
    const [imgError, setImgError] = useState(false);
    // const location = useLocation(); // Unused
    const activeMinions = useAppSelector(selectAllMinions);
    const character = useAppSelector(selectCharacter);
    const [isMinionDrawerOpen, setIsMinionDrawerOpen] = useState(false);
    const [isWandDrawerOpen, setIsWandDrawerOpen] = useState(false);
    return (
        <>
            {/* Background Image - OUTSIDE main container */}
            <BackgroundVideo />

            <div className="min-h-screen w-full relative z-10 bg-transparent text-text overflow-x-hidden">
                {/* Gradient Overlays - above background */}
                <div className="fixed inset-0 z-5 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/3 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent" />
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-dark/60 to-transparent" />
                </div>

                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40">
                    {/* Top Runic Border */}
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="bg-card/95 backdrop-blur-xl border-b border-white/10 relative">
                        {/* Corner Decorations */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/30" />
                        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/30" />

                        <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                            {/* Left: Icon and Title */}
                            <div className="flex items-center gap-4">
                                {/* Glowing Quill Icon */}
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/15 to-white/5 border-2 border-white/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                                        <Feather size={18} className="text-white" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                </div>

                                {/* Title */}
                                <div>
                                    <h1 className="font-display text-xl text-parchment-light tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        Aramancia
                                    </h1>
                                    <p className="text-[10px] text-white/50 font-sans uppercase tracking-[0.3em]">
                                        Tracker
                                    </p>
                                </div>
                            </div>

                            {/* Right: Character Info */}
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-xs text-parchment font-display">Level 5</p>
                                    <p className="text-[10px] text-muted">Necromancer</p>
                                </div>
                                {/* Character Portrait */}
                                <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden bg-card-elevated shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center">
                                    {imgError ? (
                                        <User size={20} className="text-white/50" />
                                    ) : (
                                        <img
                                            src="/assets/aramancia-portrait.jpg"
                                            alt="Aramancia"
                                            className="w-full h-full object-cover"
                                            onError={() => setImgError(true)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Ornate Border */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-24 px-4 pb-40 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10">
                    {children}
                </main>

                {/* Bottom Navigation - Scrollable */}
                <nav className="fixed bottom-0 left-0 right-0 z-50">
                    {/* Top Glow Line */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="bg-card/98 backdrop-blur-xl border-t border-white/10 relative">
                        {/* Corner Decorations */}
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/20" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/20" />

                        <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
                            {/* Evenly distributed nav items */}
                            <div className="flex items-center justify-evenly py-2 px-1">
                                {navItems.map(({ id, icon: Icon, label }) => (
                                    <button
                                        key={id}
                                        onClick={() => onTabChange(id)}
                                        className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-300 group ${activeTab === id
                                            ? 'text-white'
                                            : 'text-muted hover:text-parchment'
                                            }`}
                                    >
                                        <div className={`relative p-1.5 rounded-lg transition-all duration-300 ${activeTab === id
                                            ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.25)] border border-white/20'
                                            : 'group-hover:bg-white/5'
                                            }`}>
                                            <Icon size={16} />
                                            {activeTab === id && (
                                                <div className="absolute inset-0 rounded-lg bg-white/5 animate-pulse" />
                                            )}
                                        </div>
                                        <span className={`text-[8px] font-sans uppercase tracking-wide transition-colors duration-300 ${activeTab === id ? 'text-white' : 'group-hover:text-parchment'
                                            }`}>
                                            {label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Minion Drawer - Triggered via FAB or state */}
                {/* We need a way to open this. For now, let's add a FAB in the bottom right corner if there are minions or necromancy is relevant */}
                <div className="fixed bottom-24 right-4 flex flex-col gap-3 z-40">
                    {/* Wand Trigger */}
                    {character.inventory.some(i => i.name.toLowerCase().includes('wand')) && (
                        <button
                            onClick={() => setIsWandDrawerOpen(true)}
                            className="bg-card-elevated hover:bg-card-elevated/80 text-purple-300 border border-purple-500/30 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all animate-in zoom-in slide-in-from-bottom-4 active:scale-95"
                        >
                            <Wand2 size={24} />
                        </button>
                    )}

                    {/* Minion Drawer Trigger */}
                    <button
                        onClick={() => setIsMinionDrawerOpen(true)}
                        className="bg-card-elevated hover:bg-card-elevated/80 text-parchment border border-white/20 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all animate-in zoom-in slide-in-from-bottom-4 active:scale-95"
                    >
                        <Skull size={24} />
                        {activeMinions.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-card shadow-sm font-bold">
                                {activeMinions.length}
                            </span>
                        )}
                    </button>
                </div>

                <MinionDrawer
                    isOpen={isMinionDrawerOpen}
                    onClose={() => setIsMinionDrawerOpen(false)}
                />

                <WandDrawer
                    isOpen={isWandDrawerOpen}
                    onClose={() => setIsWandDrawerOpen(false)}
                />

            </div >

            {/* Hide scrollbar but keep functionality */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
}
