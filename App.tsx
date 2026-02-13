import React, { useState, useEffect, useCallback } from 'react';
import { GameStage, GameSettings, Player, Theme, WordPair } from './types';
import { DEFAULT_PLAYERS, THEMES, WORD_DATABASE } from './constants';
import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { Settings, User, Play, RotateCcw, Volume2, VolumeX, Plus, Trash2, Eye, EyeOff, Check, AlertTriangle, Users } from 'lucide-react';

export default function App() {
  // --- State ---
  const [stage, setStage] = useState<GameStage>('MENU');
  
  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    impostorCount: 1,
    wordMode: 'RELATED',
    theme: 'ALEATÓRIO',
    viewTimeSeconds: 5,
    soundEnabled: true,
  });

  // Player Setup
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS.map(p => ({ ...p, isImpostor: false, word: '' })));

  // Game Loop
  const [turnIndex, setTurnIndex] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // --- Effects ---
  
  // Moved useEffect here to prevent conditional hook call and fix NodeJS type error
  useEffect(() => {
    let interval: any;
    if (stage === 'PASSING' && isRevealing && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (stage === 'PASSING' && isRevealing && timeLeft === 0) {
      setIsRevealing(false);
    }
    return () => clearInterval(interval);
  }, [stage, isRevealing, timeLeft]);

  // --- Helpers ---

  const playSound = (type: 'click' | 'alert' | 'success') => {
    if (!settings.soundEnabled) return;
    // In a real app, use Audio API. Here we just log for "offline" purity/simplicity
    // console.log(`Playing sound: ${type}`);
  };

  const getRandomWordPair = (theme: Theme): WordPair => {
    let selectedTheme = theme;
    if (selectedTheme === 'ALEATÓRIO') {
      const themes = Object.keys(WORD_DATABASE) as Array<Exclude<Theme, 'ALEATÓRIO'>>;
      selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    }
    const pairs = WORD_DATABASE[selectedTheme as Exclude<Theme, 'ALEATÓRIO'>];
    return pairs[Math.floor(Math.random() * pairs.length)];
  };

  const startGame = () => {
    if (players.length < 3) return;

    // 1. Assign Roles
    const newPlayers = [...players];
    // Reset
    newPlayers.forEach(p => {
      p.isImpostor = false;
      p.word = '';
    });

    // Shuffle for impostor assignment
    const shuffledIndices = Array.from({ length: newPlayers.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);
    
    // Set Impostors
    for (let i = 0; i < settings.impostorCount; i++) {
      if (i < shuffledIndices.length) {
        newPlayers[shuffledIndices[i]].isImpostor = true;
      }
    }

    // 2. Pick Words
    const wordPair = getRandomWordPair(settings.theme);

    // 3. Assign Words to Players
    newPlayers.forEach(p => {
      if (p.isImpostor) {
        p.word = settings.wordMode === 'CLASSIC' ? 'VOCÊ É O IMPOSTOR' : wordPair.impostor;
      } else {
        p.word = wordPair.civilian;
      }
    });

    // Shuffle player order for the passing phase (so position 1 isn't always player 1)
    // Actually, keeping turn order same as list is less confusing for passing phone.
    // Let's keep the setup order.

    setPlayers(newPlayers);
    setTurnIndex(0);
    setIsRevealing(false);
    setStage('PASSING');
    playSound('click');
  };

  const handleNextTurn = () => {
    playSound('click');
    if (turnIndex >= players.length - 1) {
      setStage('DISCUSSION');
    } else {
      setTurnIndex(prev => prev + 1);
      setIsRevealing(false);
    }
  };

  // --- Render Stages ---

  const renderMenu = () => (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <div className="w-24 h-24 bg-yellow-400 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
            <User size={48} className="text-black" />
          </div>
          <h1 className="text-5xl font-black text-yellow-400 uppercase tracking-tighter leading-none">
            Jogo do<br />Impostor
          </h1>
          <p className="text-zinc-400 font-medium">Descubra quem mente.</p>
        </div>

        <div className="w-full space-y-4 pt-8">
          <Button fullWidth onClick={() => { playSound('click'); setStage('SETUP'); }}>
            <div className="flex items-center justify-center gap-3">
              <Play fill="currentColor" /> Jogar Agora
            </div>
          </Button>
          
          <Button fullWidth variant="secondary" onClick={() => { playSound('click'); setStage('SETTINGS'); }}>
            <div className="flex items-center justify-center gap-3">
              <Settings /> Configurações
            </div>
          </Button>
        </div>
      </div>
    </Layout>
  );

  const renderSetup = () => (
    <Layout 
      title="Jogadores" 
      onBack={() => setStage('MENU')}
      action={
        <button onClick={() => setSettings(s => ({...s, soundEnabled: !s.soundEnabled}))}>
          {settings.soundEnabled ? <Volume2 className="text-yellow-400"/> : <VolumeX className="text-zinc-600"/>}
        </button>
      }
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-3 pb-20">
          {players.map((player, idx) => (
            <div key={player.id} className="flex items-center gap-2 bg-zinc-800 p-3 rounded-xl border border-zinc-700">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-zinc-400">
                {idx + 1}
              </div>
              <input
                className="flex-1 bg-transparent text-white font-bold text-lg outline-none placeholder-zinc-600"
                value={player.name}
                onChange={(e) => {
                  const newPlayers = [...players];
                  newPlayers[idx].name = e.target.value;
                  setPlayers(newPlayers);
                }}
                placeholder="Nome do Jogador"
              />
              {players.length > 3 && (
                <button 
                  onClick={() => {
                    setPlayers(players.filter(p => p.id !== player.id));
                    playSound('click');
                  }}
                  className="p-2 text-zinc-500 hover:text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          
          <button 
            onClick={() => {
              setPlayers([...players, { id: Date.now().toString(), name: `Jogador ${players.length + 1}`, isImpostor: false, word: '' }]);
              playSound('click');
            }}
            className="w-full py-4 border-2 border-dashed border-zinc-700 rounded-xl text-zinc-500 font-bold flex items-center justify-center gap-2 hover:border-yellow-400 hover:text-yellow-400 transition-colors"
          >
            <Plus size={20} /> Adicionar Jogador
          </button>
        </div>

        <div className="pt-4 bg-zinc-900 border-t border-zinc-800 absolute bottom-0 left-0 right-0 p-4">
          <Button fullWidth onClick={startGame} disabled={players.length < 3}>
            Começar ({players.length})
          </Button>
        </div>
      </div>
    </Layout>
  );

  const renderSettings = () => (
    <Layout title="Configurações" onBack={() => setStage('MENU')}>
      <div className="space-y-8 pt-4">
        
        {/* Impostor Count */}
        <div className="space-y-3">
          <label className="text-zinc-400 font-bold uppercase text-sm tracking-wider flex items-center gap-2">
            <AlertTriangle size={16} /> Quantidade de Impostores
          </label>
          <div className="flex gap-2">
            {[1, 2, 3].map(count => (
              <button
                key={count}
                disabled={count >= players.length}
                onClick={() => setSettings(s => ({...s, impostorCount: count}))}
                className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${
                  settings.impostorCount === count 
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' 
                    : 'border-zinc-700 bg-zinc-800 text-zinc-400'
                } ${count >= players.length ? 'opacity-30' : ''}`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="space-y-3">
          <label className="text-zinc-400 font-bold uppercase text-sm tracking-wider">Tema das Palavras</label>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map(theme => (
              <button
                key={theme}
                onClick={() => setSettings(s => ({...s, theme}))}
                className={`py-2 px-3 rounded-lg text-sm font-bold border text-left transition-all ${
                  settings.theme === theme
                    ? 'border-yellow-400 bg-yellow-400 text-black' 
                    : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        {/* View Time */}
        <div className="space-y-3">
           <label className="text-zinc-400 font-bold uppercase text-sm tracking-wider flex items-center gap-2">
            <Eye size={16} /> Tempo de Visualização
          </label>
           <div className="flex items-center gap-4 bg-zinc-800 p-4 rounded-xl border border-zinc-700">
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={settings.viewTimeSeconds}
              onChange={(e) => setSettings(s => ({...s, viewTimeSeconds: parseInt(e.target.value)}))}
              className="flex-1 accent-yellow-400 h-2 bg-zinc-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xl font-bold text-yellow-400 w-12 text-center">{settings.viewTimeSeconds}s</span>
           </div>
        </div>

        {/* Mode */}
        <div className="space-y-3">
           <label className="text-zinc-400 font-bold uppercase text-sm tracking-wider">Modo de Jogo</label>
           <div className="flex flex-col gap-2">
              <button
                onClick={() => setSettings(s => ({...s, wordMode: 'RELATED'}))}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  settings.wordMode === 'RELATED'
                    ? 'border-yellow-400 bg-zinc-800'
                    : 'border-zinc-700 bg-zinc-800/50'
                }`}
              >
                <div className={`font-bold ${settings.wordMode === 'RELATED' ? 'text-yellow-400' : 'text-zinc-300'}`}>Palavra Parecida</div>
                <div className="text-xs text-zinc-500 mt-1">Impostor recebe uma palavra diferente mas relacionada (Mais difícil).</div>
              </button>

              <button
                onClick={() => setSettings(s => ({...s, wordMode: 'CLASSIC'}))}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  settings.wordMode === 'CLASSIC'
                    ? 'border-yellow-400 bg-zinc-800'
                    : 'border-zinc-700 bg-zinc-800/50'
                }`}
              >
                <div className={`font-bold ${settings.wordMode === 'CLASSIC' ? 'text-yellow-400' : 'text-zinc-300'}`}>Modo Clássico</div>
                <div className="text-xs text-zinc-500 mt-1">Impostor vê apenas "Você é o impostor".</div>
              </button>
           </div>
        </div>

      </div>
    </Layout>
  );

  const renderPassing = () => {
    const currentPlayer = players[turnIndex];

    return (
      <Layout onBack={() => {
          if(window.confirm('Sair da partida atual?')) setStage('MENU');
      }}>
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-300">
          
          {!isRevealing ? (
            <>
              <div className="space-y-2">
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Passe o celular para</p>
                <h2 className="text-4xl font-black text-white">{currentPlayer.name}</h2>
              </div>
              
              <div className="w-48 h-48 rounded-full border-4 border-dashed border-zinc-700 flex items-center justify-center text-zinc-700">
                <Users size={64} />
              </div>

              <Button 
                onClick={() => {
                  setTimeLeft(settings.viewTimeSeconds);
                  setIsRevealing(true);
                  playSound('click');
                }}
                className="w-64"
              >
                Eu sou {currentPlayer.name}
              </Button>
            </>
          ) : (
            <>
              <div className="w-full max-w-xs bg-zinc-800 p-8 rounded-3xl border-2 border-yellow-500/50 shadow-2xl space-y-6 relative overflow-hidden">
                 {/* Progress Bar for Timer */}
                 {timeLeft > 0 && (
                   <div className="absolute top-0 left-0 h-2 bg-yellow-400 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / settings.viewTimeSeconds) * 100}%` }} />
                 )}

                <div className="space-y-2">
                  <p className="text-yellow-600 font-bold uppercase text-xs tracking-widest">Sua Palavra Secreta</p>
                  
                  {timeLeft > 0 ? (
                    <h2 className="text-3xl font-black text-white break-words">
                      {currentPlayer.word}
                    </h2>
                  ) : (
                    <div className="flex flex-col items-center py-4 space-y-2 text-zinc-500">
                      <EyeOff size={32} />
                      <p className="text-sm font-bold">Tempo Esgotado</p>
                    </div>
                  )}
                </div>
                
                {timeLeft > 0 && (
                  <div className="text-4xl font-bold text-zinc-600 font-mono">
                    {timeLeft}
                  </div>
                )}
              </div>

              <div className="pt-8">
                 <Button 
                   fullWidth 
                   variant={timeLeft === 0 ? 'primary' : 'secondary'}
                   onClick={handleNextTurn}
                 >
                   {timeLeft === 0 ? 'Entendi, Próximo' : 'Esconder Agora'}
                 </Button>
              </div>
            </>
          )}
        </div>
      </Layout>
    );
  };

  const renderDiscussion = () => (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 bg-red-500/10 rounded-full text-red-500 mb-4 animate-pulse">
            <AlertTriangle size={64} />
          </div>
          <h1 className="text-4xl font-black text-white uppercase">Começar Debate!</h1>
          <p className="text-zinc-400 text-lg max-w-xs mx-auto">
            O cronômetro não está rodando. Discutam, façam perguntas e tentem descobrir o impostor.
          </p>
        </div>

        <div className="w-full space-y-4 pt-8">
          <Button fullWidth onClick={() => setStage('RESULTS')} variant="danger">
            Revelar Identidades
          </Button>
        </div>
      </div>
    </Layout>
  );

  const renderResults = () => {
    return (
      <Layout title="Resultado" onBack={() => setStage('MENU')}>
        <div className="flex-1 overflow-y-auto space-y-4 pb-20 pt-4">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Os impostores eram:</h2>
          </div>

          {players.filter(p => p.isImpostor).map(p => (
            <div key={p.id} className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-red-400 font-bold text-xs uppercase tracking-wider">Impostor</p>
                <p className="text-white font-black text-xl">{p.name}</p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-xs font-bold uppercase">Palavra</p>
                <p className="text-white font-bold">{p.word}</p>
              </div>
            </div>
          ))}

          <div className="border-t border-zinc-800 my-6"></div>
          
          <h3 className="text-zinc-500 font-bold uppercase text-sm tracking-wider mb-2">Civis</h3>
          {players.filter(p => !p.isImpostor).map(p => (
             <div key={p.id} className="bg-zinc-800/50 border border-zinc-700 p-3 rounded-lg flex items-center justify-between opacity-75">
               <p className="text-white font-bold">{p.name}</p>
               <span className="text-yellow-600 text-sm">{p.word}</span>
             </div>
          ))}

        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-900 border-t border-zinc-800 flex gap-3">
          <Button fullWidth variant="secondary" onClick={() => setStage('MENU')}>
            Menu
          </Button>
          <Button fullWidth onClick={() => startGame()}>
             <div className="flex items-center justify-center gap-2">
                <RotateCcw size={18} /> Jogar Novamente
             </div>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <>
       {stage === 'MENU' && renderMenu()}
       {stage === 'SETUP' && renderSetup()}
       {stage === 'SETTINGS' && renderSettings()}
       {stage === 'PASSING' && renderPassing()}
       {stage === 'DISCUSSION' && renderDiscussion()}
       {stage === 'RESULTS' && renderResults()}
    </>
  );
}