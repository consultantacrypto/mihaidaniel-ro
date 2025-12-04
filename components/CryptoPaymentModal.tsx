'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, AlertCircle, Wallet, Globe, Copy, Zap, Layers, Mail, ArrowRight } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// --- CONFIGURARE ---
const RECIPIENT_WALLET = "0xdeab68fb2be0f1756ee61ac87f4d72527ad18e3d";
const MY_EMAIL = "consultantacrypto.ro@gmail.com"; // <--- MAILUL TAU

const WALLETS = {
  EVM: RECIPIENT_WALLET,
  TRON: "TU82iRPFDmQsGuwSvZQ64atQZCfmu8aFFA",
  SOLANA: "HDyrwRnhiHWu8f1AF95ETp8nhDbeovW2SnZ7ThD8m2bk"
};

const USDT_CONTRACTS: { [key: number]: string } = {
  1: "0xdac17f958d2ee523a2206206994597c13d831ec7",     // ETH
  56: "0x55d398326f99059ff775485246999027b3197955",    // BSC
  137: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",   // Polygon
  42161: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", // Arbitrum
  8453: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",  // Base
};

const ERC20_ABI = [
  {
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  price: number;
  type: 'course' | 'consultancy';
}

export default function CryptoPaymentModal({ isOpen, onClose, title, price, type }: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState<'auto' | 'manual'>('auto');
  const [copied, setCopied] = useState(false);
  const [manualSent, setManualSent] = useState(false);
  
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const [targetNetwork, setTargetNetwork] = useState<string>("");

  useEffect(() => {
    if (chainId === 1) setTargetNetwork("Ethereum");
    else if (chainId === 56) setTargetNetwork("BSC (Binance)");
    else if (chainId === 137) setTargetNetwork("Polygon");
    else if (chainId === 42161) setTargetNetwork("Arbitrum");
    else if (chainId === 8453) setTargetNetwork("Base");
    else setTargetNetwork("Nesuportată");
  }, [chainId]);

  const handlePayment = () => {
    if (!isConnected) return;
    const contractAddress = USDT_CONTRACTS[chainId];
    if (!contractAddress) {
      alert("Schimbă rețeaua pe ETH, BSC sau Polygon.");
      return;
    }
    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [WALLETS.EVM as `0x${string}`, parseUnits(price.toString(), 6)],
      });
    } catch (e) { console.error(e); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const subject = type === 'course' ? "Plata Curs Crypto - Acces" : "Programare Consultanta";
  const body = type === 'course' 
    ? "Salut Mihai, am platit cursul. Atasez dovada (screenshot/hash). Adresa mea de Gmail pentru YouTube este: " 
    : "Salut Mihai, am platit consultanta. Atasez dovada. As dori programare in ziua: ... Interval orar: ...";
  
  const mailtoLink = `mailto:${MY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (!isOpen) return null;

  if (isConfirmed || manualSent) {
      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-[#0f1629] border border-green-500/50 w-full max-w-md p-8 rounded-3xl shadow-2xl text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border-2 border-green-500">
                    <CheckCircle2 size={40}/>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Plată Înregistrată!</h3>
                <p className="text-gray-300 mb-6">Mai ai un singur pas pentru a primi accesul.</p>
                
                <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-xl text-left mb-6">
                    <h4 className="text-blue-400 font-bold text-sm uppercase mb-2 flex items-center gap-2"><Mail size={16}/> Instrucțiuni Finale:</h4>
                    {type === 'course' ? (
                        <p className="text-sm text-white">Trimite un email la <b>{MY_EMAIL}</b> cu <b>dovada plății</b> și <b>adresa ta de GMAIL</b> (pentru a te adăuga la video-ul privat pe YouTube).</p>
                    ) : (
                        <p className="text-sm text-white">Trimite un email la <b>{MY_EMAIL}</b> cu <b>dovada plății</b> și <b>ziua/ora dorită</b> pentru consultanță.</p>
                    )}
                </div>

                <a href={mailtoLink} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mb-4">
                    Trimite Email Acum <ArrowRight size={18}/>
                </a>
                <button onClick={onClose} className="text-gray-500 hover:text-white text-sm">Închide</button>
            </motion.div>
        </div>
      )
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
        />

        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-[#0f1629] border border-blue-500/30 w-full max-w-lg p-0 rounded-3xl shadow-2xl overflow-hidden"
        >
            <div className="p-6 bg-[#0a0f1e] border-b border-white/5 relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={24}/></button>
                <h3 className="text-xl font-bold text-white text-center">Alege metoda de plată</h3>
                <p className="text-center text-gray-400 text-sm mt-1">{title}</p>
                <div className="mt-2 text-center text-3xl font-mono font-bold text-white">${price} USDT</div>
            </div>

            <div className="flex p-2 bg-[#050810]">
                <button onClick={() => setActiveTab('auto')} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'auto' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}><Zap size={16}/> Automat (EVM)</button>
                <button onClick={() => setActiveTab('manual')} className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'manual' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}><Layers size={16}/> Manual (Tron/Sol)</button>
            </div>

            <div className="p-8">
                {activeTab === 'auto' && (
                    <div className="space-y-6">
                        {!isConnected ? (
                            <div className="text-center py-4">
                                <p className="text-gray-300 mb-6 text-sm">Conectează wallet-ul pentru plată automată.</p>
                                <div className="flex justify-center transform scale-110"><ConnectButton /></div>
                            </div>
                        ) : (
                            <>
                                <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2"><Globe size={18} className="text-blue-400"/><span className="text-sm text-gray-300">Rețea:</span></div>
                                    <span className="font-bold text-white text-sm">{targetNetwork || "Unknown"}</span>
                                </div>
                                {!isPending && !isConfirming && (
                                    <button onClick={handlePayment} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]">
                                        Plătește {price} USDT
                                    </button>
                                )}
                                {isPending && <div className="text-center text-blue-400"><Loader2 className="animate-spin mx-auto mb-2"/> Confirmă în Wallet...</div>}
                                {isConfirming && <div className="text-center text-yellow-400"><Loader2 className="animate-spin mx-auto mb-2"/> Se procesează...</div>}
                                {writeError && <div className="text-center text-red-400 text-xs bg-red-500/10 p-2 rounded">Eroare: Verifică fondurile (USDT + Gas).</div>}
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'manual' && (
                    <div className="space-y-6">
                        <div className="text-center mb-4"><p className="text-sm text-gray-400">Trimite exact <b>${price} USDT</b>.</p></div>
                        
                        <div className="bg-[#1a1f2e] p-4 rounded-xl border border-white/5 hover:border-red-500/50 transition-colors group">
                            <div className="flex justify-between items-center mb-2"><span className="text-red-500 font-bold text-sm">TRON (TRC-20)</span><button onClick={() => copyToClipboard(WALLETS.TRON)} className="text-gray-400 hover:text-white"><Copy size={16}/></button></div>
                            <div className="font-mono text-xs text-gray-300 break-all">{WALLETS.TRON}</div>
                        </div>
                        
                        <div className="bg-[#1a1f2e] p-4 rounded-xl border border-white/5 hover:border-purple-500/50 transition-colors group">
                            <div className="flex justify-between items-center mb-2"><span className="text-purple-500 font-bold text-sm">SOLANA</span><button onClick={() => copyToClipboard(WALLETS.SOLANA)} className="text-gray-400 hover:text-white"><Copy size={16}/></button></div>
                            <div className="font-mono text-xs text-gray-300 break-all">{WALLETS.SOLANA}</div>
                        </div>

                        {copied && <div className="text-center text-green-500 text-xs font-bold">Adresă Copiată!</div>}
                        
                        <button onClick={() => setManualSent(true)} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg mt-4">
                            Am efectuat transferul
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}