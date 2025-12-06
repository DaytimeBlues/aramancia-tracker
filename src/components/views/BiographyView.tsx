import { biographyData, allies, enemies } from '../../data/biography';
import { Skull, Heart, Book, Scroll } from 'lucide-react';

export function BiographyView() {
    return (
        <div className="pb-20">
            {/* Hero Image */}
            <div className="relative h-56 rounded-xl overflow-hidden mb-6 border-2 border-parchment-dark/30 shadow-2xl shadow-accent/10">
                <img
                    src="/assets/aramancia-portrait.jpg"
                    alt="Aramancia Vaelithor"
                    className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-display text-2xl text-parchment-light tracking-[0.15em] drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                        Aramancia
                    </h2>
                    <p className="text-xs text-accent tracking-wider">Exiled Scholar of House Vaelithor</p>
                </div>
                {/* Corner decorations */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-accent/40" />
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-accent/40" />
            </div>

            {/* Biography Sections */}
            <div className="space-y-4 mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <Book size={18} className="text-accent" />
                    <h3 className="font-display text-lg text-parchment-light tracking-wider">Chronicles</h3>
                </div>

                {biographyData.map((section, index) => (
                    <div key={index} className="card-parchment p-4">
                        <div className="relative z-10">
                            <h4 className="text-sm font-display text-accent uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Scroll size={12} />
                                {section.title}
                            </h4>
                            <p className="text-sm text-parchment leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Allies Section */}
            <div className="mb-8">
                <div className="relative h-28 rounded-xl overflow-hidden mb-4 border border-accent/30">
                    <img
                        src="/assets/aramancia-shield.jpg"
                        alt="Aramancia Defending"
                        className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <Heart className="text-accent" size={18} />
                        <h3 className="font-display text-lg text-parchment-light tracking-wider">Allies & Kin</h3>
                    </div>
                </div>
                <div className="space-y-2">
                    {allies.map((ally, index) => (
                        <div key={index} className="card-parchment p-3 flex items-start gap-3">
                            <div className="w-1 h-full bg-accent rounded-full shrink-0 relative z-10" />
                            <div className="relative z-10">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-display text-parchment-light text-sm">{ally.name}</span>
                                    <span className="text-[9px] text-accent/70 uppercase tracking-wider">{ally.role}</span>
                                </div>
                                <p className="text-xs text-muted mt-1">{ally.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Enemies Section */}
            <div>
                <div className="relative h-28 rounded-xl overflow-hidden mb-4 border border-red-900/40">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent" />
                    <div className="absolute inset-0 bg-card" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <Skull className="text-red-400" size={18} />
                        <h3 className="font-display text-lg text-parchment-light tracking-wider">Enemies</h3>
                    </div>
                    {/* Ominous corner marks */}
                    <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-red-500/30" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-red-500/30" />
                </div>
                <div className="space-y-2">
                    {enemies.map((enemy, index) => (
                        <div key={index} className="card-parchment p-3 flex items-start gap-3 border-red-900/20">
                            <div className="w-1 h-full bg-red-500 rounded-full shrink-0 relative z-10" />
                            <div className="relative z-10">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-display text-parchment-light text-sm">{enemy.name}</span>
                                    <span className="text-[9px] text-red-400/70 uppercase tracking-wider">{enemy.role}</span>
                                </div>
                                <p className="text-xs text-muted mt-1">{enemy.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
