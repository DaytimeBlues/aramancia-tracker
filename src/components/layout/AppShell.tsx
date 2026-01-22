import { useState } from 'react';
import { Feather, Shield, Brain, User, Settings, Skull, Wand2, Backpack } from 'lucide-react';
import { BackgroundVideo } from './BackgroundVideo';
import { useAppSelector } from '../../store/hooks';
import { selectCharacter } from '../../store/slices/characterSlice';
import { selectAllMinions } from '../../store/slices/combatSlice';
import { MinionDrawer } from '../minions/MinionDrawer';
import { WandDrawer } from '../widgets/WandDrawer';
import { MinionBubble } from '../widgets/MinionBubble';
import { CombatBubble } from '../widgets/CombatBubble';
import { PanicButtons } from '../widgets/PanicButtons';
import { ConcentrationToggle } from '../widgets/ConcentrationToggle';
import { FamiliarBubble } from '../widgets/FamiliarBubble';
import { FamiliarDrawer } from '../widgets/FamiliarDrawer';
import { DraggableContainer } from '../widgets/DraggableContainer';


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

    // Helper to determine class display
    const characterClass = 'Necromancer'; // Thematic update

    return (
        <>
            {/* Background Image - OUTSIDE main container */}
            <BackgroundVideo />

            <div className="min-h-screen w-full relative z-10 bg-transparent text-text overflow-x-hidden selection:bg-accent/30">
                {/* Gradient Overlays - Deeper, more atmospheric */}
                <div className="fixed inset-0 z-5 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-bg-dark via-bg-dark/95 to-transparent" />
                </div>

                {/* Header - High Fidelity */}
                <header className="fixed top-0 left-0 right-0 z-40">
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent shadow-[0_0_10px_rgba(139,92,246,0.3)]" />

                    <div className="bg-bg-dark/80 backdrop-blur-2xl border-b border-white/5 relative">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
                            {/* Left: Icon and Title */}
                            <div className="flex items-center gap-4 group">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent/20 to-transparent border border-accent/20 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.15)] group-hover:border-accent/40 transition-all duration-500">
                                        <Feather size={18} className="text-accent-glow" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-soul-green border-2 border-bg-dark animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                </div>

                                <div>
                                    <h1 className="font-display text-xl text-white tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] leading-none uppercase">
                                        Aramancia
                                    </h1>
                                    <p className="text-[10px] text-accent font-black uppercase tracking-[0.4em] mt-1.5 opacity-80 font-sans">
                                        Arcane Matrix
                                    </p>
                                </div>
                            </div>


                            {/* Right: Character Info */}
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] text-accent font-black uppercase tracking-widest leading-none mb-1">Soul Tier {character.level}</p>
                                    <p className="text-xs text-white font-display tracking-wider uppercase opacity-80">{characterClass}</p>
                                </div>
                                <div className="relative group/avatar">
                                    <div className="absolute inset-[-4px] bg-gradient-to-tr from-accent/20 to-soul-green/20 blur-lg rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                                    <div className="w-10 h-10 rounded-2xl border border-white/10 overflow-hidden bg-black/60 shadow-inner flex items-center justify-center relative z-10 group-hover/avatar:border-accent/40 transition-all">
                                        {imgError ? (
                                            <User size={20} className="text-white/30" />
                                        ) : (
                                            <img
                                                src={`${import.meta.env.BASE_URL}assets/aramancia-portrait.jpg`}
                                                alt="Aramancia"
                                                className="w-full h-full object-cover opacity-90 group-hover/avatar:scale-110 transition-transform duration-500"
                                                onError={() => setImgError(true)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-36 max-w-7xl mx-auto relative z-10">
                    {children}
                </main>

                {/* Bottom Navigation - Premium Glassmorphism */}
                <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

                    <div className="bg-bg-dark/95 backdrop-blur-3xl border-t border-white/5 relative">
                        <div className="max-w-4xl mx-auto h-[72px]">
                            <div className="flex items-center justify-between px-3 h-full gap-1">
                                {navItems.map(({ id, icon: Icon, label }) => {
                                    const isActive = activeTab === id;
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => onTabChange(id)}
                                            aria-label={label}
                                            className={`
                                                relative group flex-1 flex flex-col items-center justify-center rounded-2xl transition-all duration-500 tap-feedback
                                                ${isActive ? 'scale-110 -translate-y-1' : 'hover:bg-white/[0.02]'}
                                            `}
                                        >
                                            <div className={`
                                                relative p-2.5 rounded-2xl transition-all duration-500 mb-1
                                                ${isActive
                                                    ? 'bg-accent/20 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-accent/30'
                                                    : 'text-phantom/60 group-hover:text-phantom group-hover:bg-white/5'}
                                            `}>
                                                <Icon size={18} className="transition-transform duration-500 group-hover:scale-110" />
                                                {isActive && (
                                                    <div className="absolute inset-0 rounded-2xl bg-accent/10 animate-pulse" />
                                                )}
                                            </div>
                                            <span className={`
                                                text-[8px] font-black uppercase tracking-[0.2em] font-sans transition-all duration-500
                                                ${isActive ? 'text-white opacity-100 scale-100' : 'text-phantom/40 opacity-0 h-0 overflow-hidden scale-90'}
                                            `}>
                                                {label}
                                            </span>

                                            {/* Active Indicator Dot */}
                                            {isActive && (
                                                <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(139,92,246,1)]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Panic Buttons - Bottom Left */}
                <DraggableContainer
                    widgetId="panicButtons"
                    defaultPosition={{ xPercent: 8, yPercent: 75 }}
                    bubbleSize={{ width: 56, height: 56 }}
                >
                    <PanicButtons />
                </DraggableContainer>

                {/* Draggable Concentration Toggle */}
                <DraggableContainer
                    widgetId="concentrationToggle"
                    defaultPosition={{ xPercent: 92, yPercent: 45 }}
                    bubbleSize={{ width: 56, height: 56 }}
                >
                    <ConcentrationToggle />
                </DraggableContainer>

                {/* Draggable Combat Bubble */}
                <DraggableContainer
                    widgetId="combatBubble"
                    onClick={() => onTabChange('combat')}
                    defaultPosition={{ xPercent: 92, yPercent: 65 }}
                    bubbleSize={{ width: 56, height: 56 }}
                >
                    <CombatBubble onClick={() => { }} />
                </DraggableContainer>

                {/* Draggable Wand Bubble */}
                {character.inventory.some(i => i.name.toLowerCase().includes('wand')) && (
                    <DraggableContainer
                        widgetId="wandBubble"
                        onClick={() => setIsWandDrawerOpen(true)}
                        defaultPosition={{ xPercent: 92, yPercent: 85 }}
                        bubbleSize={{ width: 56, height: 56 }}
                    >
                        <button
                            aria-label="Open Wand Drawer"
                            title="Open Wand Drawer"
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-purple-400 bg-purple-950/40 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-110 transition-all tap-feedback backdrop-blur-xl"
                        >
                            <Wand2 size={26} />
                        </button>
                    </DraggableContainer>
                )}

                {/* Draggable Familiar Bubble */}
                {character.familiar && (
                    <DraggableContainer
                        widgetId="familiarBubble"
                        onClick={() => setIsFamiliarDrawerOpen(true)}
                        defaultPosition={{ xPercent: 92, yPercent: 55 }}
                        bubbleSize={{ width: 56, height: 56 }}
                    >
                        <FamiliarBubble
                            familiar={character.familiar}
                            onClick={() => { }}
                        />
                    </DraggableContainer>
                )}

                {/* Draggable MinionBubble */}
                {activeMinions.length > 0 && (
                    <DraggableContainer
                        widgetId="minionBubble"
                        onClick={() => setIsMinionDrawerOpen(true)}
                        defaultPosition={{ xPercent: 92, yPercent: 75 }}
                        bubbleSize={{ width: 56, height: 56 }}
                    >
                        <MinionBubble
                            minions={activeMinions}
                            onClick={() => { }}
                        />
                    </DraggableContainer>
                )}


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

            </div>

            {/* Global Styles */}
            <style>{`
                .pb-safe {
                    padding-bottom: env(safe-area-inset-bottom, 24px);
                }
                .selection\\:bg-accent\\/30 ::selection {
                    background-color: rgba(139, 92, 246, 0.3);
                }
            `}</style>
        </>
    );
}
