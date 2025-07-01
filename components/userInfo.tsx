'use client'

import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from 'wagmi';
import Image from 'next/image';
import { ethers } from 'ethers';
import { useGlobalContext } from "@/src/context/global.context";
import Loading from './ui/loading';
import { toast } from "react-toastify";

const DEFAULT_AVATAR = '/images/avatar-01.jpg';
const AWK_TOKEN_ADDRESS = '0x380DF89D883776ba04f65569F1D1A6E218bFc2dF';
const RECEIVER_ADDRESS = '0xC2dAe8b4821A37485E44D2947fC84b15C88034BD';
const CREDIT_BALANCE = 10;

const UserInfoModal = ({
    setShowNamePrompt,
    showNamePrompt,
    setUserName,
    userName
}: {
    setShowNamePrompt: (show: boolean) => void,
    showNamePrompt: boolean,
    setUserName: (name: string) => void,
    userName: string
}) => {
    const { value } = useGlobalContext();
    const [name, setName] = useState('No name');
    const [dob, setDob] = useState('');
    const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR);
    const [credit, setCredit] = useState(0);
    const [buyAmount, setBuyAmount] = useState('');
    const { isConnected } = useAccount();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const { data: walletClient } = useWalletClient();
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setAvatarLoading(true);
        const formData = new FormData();
        if (e.target.files && e.target.files[0]) {
            formData.append("file", e.target.files[0]);
        }
        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        const json = await res.json();
        if (json.success) setAvatarUrl(json.avatarUrl);
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setAvatar(ev.target.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        setAvatarLoading(false);
        toast.success(json.message);
    };

    const handleBuyCredit = async () => {
        if (!buyAmount || isNaN(Number(buyAmount))) {
            toast.warning('Enter a valid amount!')
            return;
        }
        try {
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(walletClient?.transport as any);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                AWK_TOKEN_ADDRESS,
                ['function transfer(address to, uint256 amount) public returns (bool)'],
                signer
            );

            const multipliedAmount = (Number(buyAmount) * CREDIT_BALANCE).toString();
            const amount = ethers.utils.parseUnits(multipliedAmount, 18);

            const tx = await contract.transfer(RECEIVER_ADDRESS, amount);
            await tx.wait();

            let res = await fetch('/api/profile', {
                method: "POST",
                body: JSON.stringify({ wallet_address: value.wallet_address.toLowerCase(), credit_balance: Number(credit) + Number(buyAmount) })
            })
            let creditRes = await res.json();
            if (creditRes.success) {
                toast.success('Credit purchased successfully!')
            } else toast.error(creditRes.message);
            setCredit((prev) => prev + Number(buyAmount));
            setBuyAmount('');
        } catch (err: any) {
            if (err && typeof err === 'object' && 'code' in err && err.code === 4001) {
                toast.info('You rejected the wallet request.')
            } else {
                toast.info('Transaction failed. Please check your balance!')
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!name || !dob) {
            toast.warning('Please input your name and date of birth!');
            return;
        }
        setUserName(name);
        setSaveLoading(true);
        const res = await fetch("/api/profile", {
            method: "POST",
            body: JSON.stringify({ wallet_address: value.wallet_address.toLowerCase(), user_name: name, user_birth: dob, avatar_url: avatarUrl })
        });
        const json = await res.json();
        setEditing(false);
        setSaveLoading(false);
        setShowNamePrompt(false);
        if (json.success) toast.success("User changed successfully!");
        else toast.error("Changing error!");
    };

    useEffect(() => {
        if (isConnected && value.id) {
            const getInfo = async () => {
                try {
                    setName(value.user_name);
                    setDob(value.user_birth);
                    setCredit(value.credit_balance)
                    if (value.avatar_url) setAvatar(value.avatar_url);
                    else setAvatar(DEFAULT_AVATAR);
                } catch (error) {
                    console.log("Get userInfo error!");
                }
            }
            getInfo();
        }
    }, [isConnected, value.id])

    if (!showNamePrompt) return null;

    return (
        <div id="nameModal" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-3xl mx-4 md:mx-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-purple-900/40 p-0 overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
                {/* Left: Profile Image & Edit */}
                <div className="flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/40 via-blue-900/20 to-gray-900/10 md:w-1/3 w-full py-10 px-6 gap-6">
                    <div className="relative w-36 h-36 md:w-40 md:h-40 mb-2 group">
                        <Image src={avatar} alt="Profile" fill className="rounded-2xl object-cover border-4 border-purple-400 shadow-xl transition-all duration-300 group-hover:scale-105" />
                        {avatarLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl z-10">
                                <Loading size="lg" text="Uploading..." fullscreen={false} />
                            </div>
                        )}
                        {editing && !avatarLoading && (
                            <label className="absolute bottom-2 right-2 bg-purple-700/90 text-white px-3 py-1.5 rounded-lg cursor-pointer text-xs shadow-lg hover:bg-purple-800 transition-all">
                                Change
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        )}
                    </div>
                </div>
                {/* Right: Info & Actions */}
                <div className="flex-1 flex flex-col justify-between px-6 py-8 gap-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-2">
                        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">User Profile</h2>
                        <div className="text-lg font-semibold text-right">Credit Balance: <span className="text-purple-400">{credit ? credit : "0"}</span></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div className="relative">
                            <input
                                type="text"
                                id="name-input"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className={`peer w-full px-4 pt-6 pb-2 rounded-xl border-2 ${editing ? 'border-purple-400 bg-gray-900/80' : 'border-gray-700 bg-gray-900/40'} text-white focus:border-pink-400 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-200 font-semibold`}
                                placeholder=" "
                                disabled={!editing}
                            />
                            <label htmlFor="name-input" className="absolute left-4 top-2 text-sm text-purple-300 pointer-events-none transition-all duration-200 peer-focus:top-1 peer-focus:text-xs peer-focus:text-pink-400 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 font-semibold">Name</label>
                        </div>
                        {/* DOB Input */}
                        <div className="relative">
                            <input
                                type="date"
                                id="dob-input"
                                value={dob}
                                onChange={e => setDob(e.target.value)}
                                className={`peer w-full px-4 pt-6 pb-2 rounded-xl border-2 ${editing ? 'border-purple-400 bg-gray-900/80' : 'border-gray-700 bg-gray-900/40'} text-white focus:border-pink-400 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-200 font-semibold`}
                                placeholder=" "
                                disabled={!editing}
                            />
                            <label htmlFor="dob-input" className="absolute left-4 top-2 text-sm text-purple-300 pointer-events-none transition-all duration-200 peer-focus:top-1 peer-focus:text-xs peer-focus:text-pink-400 peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 font-semibold">Date of Birth</label>
                        </div>
                    </div>
                    {/* Credit Purchase */}
                    <div className="mt-2">
                        <label className="block font-semibold mb-1 text-purple-200">Amount of Credit to Buy</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min="1"
                                value={buyAmount}
                                onChange={e => setBuyAmount(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-purple-400 bg-gray-900/80 text-white focus:border-pink-400 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-200 font-semibold"
                                placeholder="Enter amount"
                                disabled={loading}
                            />
                            <button
                                onClick={handleBuyCredit}
                                className="min-w-[90px] cursor-pointer px-6 py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 text-white rounded-xl font-bold shadow-lg hover:from-purple-600 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loading size="sm" variant="nothing" color="white" text="Processing..." />
                                ) : (
                                    'Buy Credit'
                                )}
                            </button>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">1 CREDIT = 10 AWK TOKEN.</div>
                    </div>
                    {error && <div className="text-red-400 text-sm font-semibold text-center mt-2">{error}</div>}
                    <div className="flex flex-col md:flex-row justify-end gap-3 mt-8">
                        {editing ? (
                            <>
                                <button
                                    className="cursor-pointer px-5 py-2 bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 text-white rounded-xl font-bold shadow-lg hover:from-purple-600 hover:to-blue-700 transition-all text-base min-w-[90px]"
                                    onClick={() => setEditing(prev => !prev)}
                                    disabled={!editing}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="cursor-pointer px-5 py-2 bg-green-500 text-white rounded-xl font-bold shadow-lg hover:bg-green-600 transition-all disabled:opacity-50 min-w-[90px] flex items-center justify-center gap-2"
                                    disabled={!name || !dob || saveLoading}
                                >
                                    {saveLoading ? <Loading size="sm" variant="nothing" text="Saving..." /> : 'Save'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="cursor-pointer px-5 py-2 bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 text-white rounded-xl font-bold shadow-lg hover:from-purple-600 hover:to-blue-700 transition-all text-base min-w-[90px]"
                                    onClick={() => setEditing(prev => !prev)}
                                    disabled={editing}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => setShowNamePrompt(false)}
                                    className="cursor-pointer px-5 py-2 bg-gray-600 text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all min-w-[90px]"
                                >
                                    Close
                                </button>
                            </>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfoModal;