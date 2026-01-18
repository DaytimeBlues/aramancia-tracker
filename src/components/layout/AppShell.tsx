import { useState } from 'react';
import { Feather, Shield, Brain, User, Settings, Skull, Wand2, Backpack, Zap } from 'lucide-react';
import { BackgroundVideo } from './BackgroundVideo';
import { useAppSelector } from '../../store/hooks';
import { selectCharacter } from '../../store/slices/characterSlice';
import { selectAllMinions } from '../../store/slices/combatSlice';
import { MinionDrawer } from '../minions/MinionDrawer';
import { WandDrawer } from '../widgets/WandDrawer';
import { MinionBubble } from '../widgets/MinionBubble';
import { CombatBubble } from '../widgets/CombatBubble';
import { ModeToggle } from '../widgets/ModeToggle';
import { PanicButtons } from '../widgets/PanicButtons';
import { ConcentrationToggle } from '../widgets/ConcentrationToggle';
import { FamiliarBubble } from '../widgets/FamiliarBubble';
import { FamiliarDrawer } from '../widgets/FamiliarDrawer';
import { SummonManager } from '../widgets/SummonManager';


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
    const activeMinions = useAppSelector(selectAllMinions);
    const character = useAppSelector(selectCharacter);
    const [isMinionDrawerOpen, setIsMinionDrawerOpen] = useState(false);
    const [isWandDrawerOpen, setIsWandDrawerOpen] = useState(false);
    const [isFamiliarDrawerOpen, setIsFamiliarDrawerOpen] = useState(false);
    const [isSummonManagerOpen, setIsSummonManagerOpen] = useState(false);

    // Helper to determine class display
    const characterClass = 'Warlock'; // Default for now as per tracker focus

    return (
        <>
            {/* Background Image - OUTSIDE main container */}
            <BackgroundVideo />

            <div className="min-h-screen w-full relative z-10 bg-transparent text-text overflow-x-hidden">
                {/* Gradient Overlays */}
                <div className="fixed inset-0 z-5 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/3 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent" />
                </div>

                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-40">
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="bg-bg-dark/80 backdrop-blur-xl border-b border-white/10 relative shadow-lg">
                        <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                            {/* Left: Icon and Title */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                        <Feather size={16} className="text-parchment" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(212,177,58,0.5)]" />
                                </div>

                                <div>
                                    <h1 className="font-display text-lg text-parchment-light tracking-[0.15em] drop-shadow-md leading-none">
                                        Aramancia
                                    </h1>
                                    <p className="text-[9px] text-muted/60 font-sans uppercase tracking-[0.25em]">
                                        Tracker
                                    </p>
                                </div>
                            </div>

                            {/* Center: Mode Toggle */}
                            <ModeToggle />

                            {/* Right: Character Info */}
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs text-parchment font-display">Level {character.level}</p>
                                    <p className="text-[10px] text-muted">{characterClass}</p>
                                </div>
                                <div className="w-9 h-9 rounded-full border border-white/20 overflow-hidden bg-black/40 shadow-inner flex items-center justify-center">
                                    {imgError ? (
                                        <User size={18} className="text-white/30" />
                                    ) : (
                                        <img
                                            src="/assets/aramancia-portrait.jpg"
                                            alt="Aramancia"
                                            className="w-full h-full object-cover opacity-90"
                                            onError={() => setImgError(true)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-20 px-4 pb-32 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto relative z-10 animate-fade-in">
                    {children}
                </main>

                {/* Bottom Navigation - Premium Glassmorphism */}
                <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="bg-bg-dark/90 backdrop-blur-2xl border-t border-white/10 relative">
                        <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
                            <div className="flex items-center justify-between px-2 py-2">
                                {navItems.map(({ id, icon: Icon, label }) => {
                                    const isActive = activeTab === id;
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => onTabChange(id)}
                                            aria-label={label}
                                            className="relative group flex-1 flex flex-col items-center justify-center pt-2 pb-1 mx-0.5 rounded-xl transition-all duration-300 tap-feedback min-h-[56px]"
                                        >
                                            <div className={`
                                                relative p-2 rounded-xl transition-all duration-300 mb-0.5
                                                ${isActive ? 'bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.15)] -translate-y-1' : 'group-hover:bg-white/5'}
                                            `}>
                                                <Icon
                                                    size={20}
                                                    className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-muted group-hover:text-parchment'}`}
                                                />
                                                {isActive && (
                                                    <div className="absolute inset-0 rounded-xl bg-white/5 animate-pulse" />
                                                )}
                                            </div>
                                            <span className={`
                                                text-[9px] font-sans font-medium uppercase tracking-wider transition-all duration-300
                                                ${isActive ? 'text-white translate-y-0 opacity-100' : 'text-muted/60 opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto translate-y-2 group-hover:translate-y-0'}
                                            `}>
                                                {label}
                                            </span>

                                            {/* Active Indicator Dot */}
                                            {isActive && (
                                                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-accent shadow-[0_0_5px_rgba(212,177,58,0.8)]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* FABs Container */}
                <div className="fixed bottom-24 right-4 flex flex-col gap-4 z-40 pointer-events-none">
                    <div className="pointer-events-auto flex flex-col gap-3 items-end">
                        {/* Concentration Toggle - Prominent for Wizards */}
                        <ConcentrationToggle />

                        {/* Combat Bubble - Always visible */}
                        <CombatBubble onClick={() => onTabChange('combat')} />

                        {/* Wand Trigger */}
                        {character.inventory.some(i => i.name.toLowerCase().includes('wand')) && (
                            <button
                                onClick={() => setIsWandDrawerOpen(true)}
                                className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-purple-300 border-purple-500/30 hover:bg-purple-900/40 hover:scale-105 active:scale-95 transition-all shadow-lg tap-feedback backdrop-blur-md"
                            >
                                <Wand2 size={24} />
                            </button>
                        )}

                        {/* Familiar Bubble */}
                        <FamiliarBubble
                            familiar={character.familiar}
                            onClick={() => setIsFamiliarDrawerOpen(true)}
                        />

                        {/* Minion Bubble - Premium Summary & Trigger */}
                        <MinionBubble
                            minions={activeMinions}
                            onClick={() => setIsMinionDrawerOpen(true)}
                        />

                        {/* Summon Manager Trigger (Combat Mode only) */}
                        {activeTab === 'combat' && (
                            <button
                                onClick={() => setIsSummonManagerOpen(true)}
                                className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-yellow-300 border-yellow-500/30 hover:bg-yellow-900/40 hover:scale-105 active:scale-95 transition-all shadow-lg tap-feedback backdrop-blur-md"
                                title="Summon Creatures"
                            >
                                <Zap size={24} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Panic Buttons - Bottom Left (Fitts's Law) */}
                <PanicButtons />

                <MinionDrawer
                    isOpen={isMinionDrawerOpen}
                    onClose={() => setIsMinionDrawerOpen(false)}
                />

                <WandDrawer
                    isOpen={isWandDrawerOpen}
                    onClose={() => setIsWandDrawerOpen(false)}
                />

                <FamiliarDrawer
                    isOpen={isFamiliarDrawerOpen}
                    onClose={() => setIsFamiliarDrawerOpen(false)}
                />

                <SummonManager
                    isOpen={isSummonManagerOpen}
                    onClose={() => setIsSummonManagerOpen(false)}
                />

            </div>

            {/* Global Styles */}
            <style>{`
                .pb-safe {
                    padding-bottom: env(safe-area-inset-bottom, 20px);
                }
            `}</style>
        </>
    );
}
