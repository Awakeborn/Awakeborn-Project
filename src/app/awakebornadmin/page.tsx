"use client";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = "https://jkpswqodrvbyemeaatwo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprcHN3cW9kcnZieWVtZWFhdHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMjEwNjEsImV4cCI6MjA2NjY5NzA2MX0.P2ZuI5QhzmAu-yI09gOgiM-tF8Rh3TdyOLPfiAN9Rr8";
const supabase = createClient(supabaseUrl, supabaseKey);

const TABS = ["Users", "Chat History", "Credit Pricing"];

export default function AwakebornAdmin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [activeTab, setActiveTab] = useState(TABS[0]);

    // Users state
    const [users, setUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState("");

    // Chat history state
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [chatLoading, setChatLoading] = useState(false);
    const [chatError, setChatError] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Credit pricing state
    const [creditPrice, setCreditPrice] = useState<number | null>(null);
    const [creditPriceInput, setCreditPriceInput] = useState("");
    const [creditPriceLoading, setCreditPriceLoading] = useState(false);
    const [creditPriceError, setCreditPriceError] = useState("");
    const [creditPriceSuccess, setCreditPriceSuccess] = useState("");

    // Change password state
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [changePassLoading, setChangePassLoading] = useState(false);
    const [changePassError, setChangePassError] = useState("");
    const [changePassSuccess, setChangePassSuccess] = useState("");

    // Admin config state
    const [adminConfig, setAdminConfig] = useState<any>(null);

    // --- Add state for modals and editing ---
    const [editUser, setEditUser] = useState<any>(null);
    const [editUserLoading, setEditUserLoading] = useState(false);
    const [editUserError, setEditUserError] = useState("");
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
    const [deleteUserLoading, setDeleteUserLoading] = useState(false);
    const [deleteUserError, setDeleteUserError] = useState("");

    const [editChat, setEditChat] = useState<any>(null);
    const [editChatLoading, setEditChatLoading] = useState(false);
    const [editChatError, setEditChatError] = useState("");
    const [deleteChatId, setDeleteChatId] = useState<string | null>(null);
    const [deleteChatLoading, setDeleteChatLoading] = useState(false);
    const [deleteChatError, setDeleteChatError] = useState("");

    // --- Add state for viewing chat input/output details ---
    const [viewDetail, setViewDetail] = useState<{ field: 'input' | 'output', value: string } | null>(null);

    // Load admin config on mount
    useEffect(() => {
        loadAdminConfig();
    }, []);

    const loadAdminConfig = async () => {
        try {
            const { data, error } = await supabase
                .from('admin_config')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
                console.error('Error loading admin config:', error);
                // Create default config if table doesn't exist
                const defaultConfig = { password: 'admin123', credit_price: 10 };
                setAdminConfig(defaultConfig);
            } else {
                setAdminConfig(data || { password: 'admin123', credit_price: 10 });
            }
        } catch (error) {
            console.error('Error loading admin config:', error);
            setAdminConfig({ password: 'admin123', credit_price: 10 });
        }
    };

    // Login logic using Supabase
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!adminConfig) {
            setLoginError("Admin config not loaded");
            return;
        }

        if (password === adminConfig.password) {
            setIsAuthenticated(true);
            setLoginError("");
        } else {
            setLoginError("Incorrect password");
        }
    };

    // Fetch users using Supabase
    useEffect(() => {
        if (isAuthenticated && activeTab === "Users") {
            setUsersLoading(true);
            setUsersError("");

            const fetchUsers = async () => {
                try {
                    const { data, error } = await supabase
                        .from('user_list')
                        .select('*')
                        .order('inserted_at', { ascending: false });
                    if (error) {
                        setUsersError(error.message);
                    } else {
                        setUsers(data || []);
                    }
                } catch (error) {
                    setUsersError("Failed to fetch users");
                } finally {
                    setUsersLoading(false);
                }
            };

            fetchUsers();
        }
    }, [isAuthenticated, activeTab]);

    // Fetch chat history using Supabase
    useEffect(() => {
        if (isAuthenticated && activeTab === "Chat History") {
            setChatLoading(true);
            setChatError("");

            const fetchChatHistory = async () => {
                try {
                    let query = supabase
                        .from('chat_histories')
                        .select('*')
                        .order('date', { ascending: false });

                    if (selectedUser && selectedUser.wallet_address) {
                        query = query.eq('wallet', selectedUser.wallet_address);
                    }

                    const { data, error } = await query;

                    if (error) {
                        setChatError(error.message);
                    } else {
                        setChatHistory(data || []);
                    }
                } catch (error) {
                    setChatError("Failed to fetch chat history");
                } finally {
                    setChatLoading(false);
                }
            };

            fetchChatHistory();
        }
    }, [isAuthenticated, activeTab, selectedUser]);

    // Fetch credit price using Supabase
    useEffect(() => {
        if (isAuthenticated && activeTab === "Credit Pricing") {
            setCreditPriceLoading(true);
            setCreditPriceError("");
            setCreditPriceSuccess("");

            const fetchCreditPrice = async () => {
                try {
                    if (adminConfig) {
                        setCreditPrice(adminConfig.credit_price);
                        setCreditPriceInput(adminConfig.credit_price.toString());
                    }
                } catch (error) {
                    setCreditPriceError("Failed to fetch credit price");
                } finally {
                    setCreditPriceLoading(false);
                }
            };

            fetchCreditPrice();
        }
    }, [isAuthenticated, activeTab, adminConfig]);

    // Handle credit price update using Supabase
    const handleCreditPriceUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreditPriceLoading(true);
        setCreditPriceError("");
        setCreditPriceSuccess("");

        try {
            const newPrice = Number(creditPriceInput);

            // Update admin config in Supabase
            const { error } = await supabase
                .from('admin_config')
                .upsert({
                    id: 1, // Assuming single row
                    credit_price: newPrice,
                    password: adminConfig?.password || 'admin123'
                });

            if (error) {
                setCreditPriceError(error.message);
            } else {
                setCreditPrice(newPrice);
                setAdminConfig((prev: any) => ({ ...prev, credit_price: newPrice }));
                setCreditPriceSuccess("Credit price updated!");
            }
        } catch (error) {
            setCreditPriceError("Failed to update credit price");
        } finally {
            setCreditPriceLoading(false);
        }
    };

    // Handle change password using Supabase
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setChangePassLoading(true);
        setChangePassError("");
        setChangePassSuccess("");

        try {
            if (!adminConfig) {
                setChangePassError("Admin config not loaded");
                return;
            }

            if (oldPassword !== adminConfig.password) {
                setChangePassError("Old password incorrect");
                return;
            }

            // Update admin config in Supabase
            const { error } = await supabase
                .from('admin_config')
                .upsert({
                    id: 1, // Assuming single row
                    password: newPassword,
                    credit_price: adminConfig.credit_price
                });

            if (error) {
                setChangePassError(error.message);
            } else {
                setAdminConfig((prev: any) => ({ ...prev, password: newPassword }));
                setChangePassSuccess("Password changed successfully!");
                setOldPassword("");
                setNewPassword("");
            }
        } catch (error) {
            setChangePassError("Failed to change password");
        } finally {
            setChangePassLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword("");
        setLoginError("");
        setActiveTab(TABS[0]);
        setUsers([]);
        setChatHistory([]);
        setSelectedUser(null);
        setCreditPrice(null);
        setCreditPriceInput("");
        setOldPassword("");
        setNewPassword("");
        setChangePassError("");
        setChangePassSuccess("");
        setCreditPriceError("");
        setCreditPriceSuccess("");
    };

    // --- User Edit Handler ---
    const handleUserEditSave = async () => {
        setEditUserLoading(true);
        setEditUserError("");
        try {
            const { error } = await supabase
                .from('user_list')
                .update({
                    user_name: editUser.user_name,
                    user_birth: editUser.user_birth,
                    credit_balance: editUser.credit_balance,
                    avatar_url: editUser.avatar_url,
                })
                .eq('id', editUser.id);
            if (error) setEditUserError(error.message);
            else {
                setEditUser(null);
                // Refresh users
                const { data } = await supabase.from('user_list').select('*').order('inserted_at', { ascending: false });
                setUsers(data || []);
            }
        } catch (e) {
            setEditUserError('Failed to update user');
        } finally {
            setEditUserLoading(false);
        }
    };

    // --- User Delete Handler ---
    const handleUserDelete = async () => {
        if (!deleteUserId) return;
        setDeleteUserLoading(true);
        setDeleteUserError("");
        try {
            const { error } = await supabase.from('user_list').delete().eq('id', deleteUserId);
            if (error) setDeleteUserError(error.message);
            else {
                setDeleteUserId(null);
                // Refresh users
                const { data } = await supabase.from('user_list').select('*').order('inserted_at', { ascending: false });
                setUsers(data || []);
            }
        } catch (e) {
            setDeleteUserError('Failed to delete user');
        } finally {
            setDeleteUserLoading(false);
        }
    };

    // --- Chat Edit Handler ---
    const handleChatEditSave = async () => {
        setEditChatLoading(true);
        setEditChatError("");
        try {
            const { error } = await supabase
                .from('chat_histories')
                .update({
                    input: editChat.input,
                    output: editChat.output,
                })
                .eq('id', editChat.id);
            if (error) setEditChatError(error.message);
            else {
                setEditChat(null);
                // Refresh chat
                let query = supabase.from('chat_histories').select('*').order('inserted_at', { ascending: false });
                if (selectedUser && selectedUser.wallet_address) query = query.eq('wallet', selectedUser.wallet_address);
                const { data } = await query;
                setChatHistory(data || []);
            }
        } catch (e) {
            setEditChatError('Failed to update chat');
        } finally {
            setEditChatLoading(false);
        }
    };

    // --- Chat Delete Handler ---
    const handleChatDelete = async () => {
        if (!deleteChatId) return;
        setDeleteChatLoading(true);
        setDeleteChatError("");
        try {
            const { error } = await supabase.from('chat_histories').delete().eq('id', deleteChatId);
            if (error) setDeleteChatError(error.message);
            else {
                setDeleteChatId(null);
                // Refresh chat
                let query = supabase.from('chat_histories').select('*').order('date', { ascending: false });
                if (selectedUser && selectedUser.wallet_address) query = query.eq('wallet', selectedUser.wallet_address);
                const { data } = await query;
                setChatHistory(data || []);
            }
        } catch (e) {
            setDeleteChatError('Failed to delete chat');
        } finally {
            setDeleteChatLoading(false);
        }
    };

    return (
        <div className="min-h-screen animate-fade-in bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950 flex items-center justify-center p-4">
            <div className="w-full animate-fade-in max-w-5xl bg-gray-900/90 rounded-3xl shadow-2xl border border-purple-900/40 p-8 md:p-12 animate-fade-in-up">
                <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-xl tracking-tight">
                    Awakeborn Admin
                </h1>
                {!isAuthenticated ? (
                    <form onSubmit={handleLogin} className="flex animate-fade-in flex-col gap-6 items-center">
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Admin Password"
                            className="w-full max-w-xs px-4 py-3 rounded-xl bg-gray-800 text-white border border-purple-900/40 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm text-lg"
                        />
                        {loginError && <div className="text-red-400 font-semibold">{loginError}</div>}
                        <button
                            type="submit"
                            className="w-full max-w-xs px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 text-white text-lg bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 cursor-pointer ring-1 ring-inset ring-purple-400/20 hover:shadow-xl transform hover:scale-105"
                        >
                            Login
                        </button>
                    </form>
                ) : (
                    <div className="animate-fade-in">
                        <div className="flex animate-fade-in justify-between items-center mb-8">
                            <div className="flex gap-2 md:gap-4">
                                {TABS.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => { setActiveTab(tab); if (tab !== "Chat History") setSelectedUser(null); }}
                                        className={`cursor-pointer px-4 py-2 rounded-lg font-bold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/40 ${activeTab === tab
                                            ? "bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 text-white shadow-lg"
                                            : "bg-gray-800 text-purple-200 hover:bg-purple-900/40"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 rounded-lg font-bold text-base transition-all duration-200 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/40 ring-1 ring-inset ring-purple-400/20"
                            >
                                Logout
                            </button>
                        </div>
                        <div className="bg-gray-950/80 animate-fade-in rounded-2xl p-6 min-h-[300px] shadow-inner border border-purple-900/20">
                            {activeTab === "Users" && (
                                <div>
                                    {usersLoading ? (
                                        <div className="text-center text-purple-300 py-8">Loading users...</div>
                                    ) : usersError ? (
                                        <div className="text-center text-red-400 py-8">{usersError}</div>
                                    ) : (
                                        <div className="overflow-x-auto animate-fade-in">
                                            <table className="min-w-full text-sm md:text-base border-separate border-spacing-y-2 text-center">
                                                <thead>
                                                    <tr className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 text-purple-200">
                                                        <th className="px-4 py-2 rounded-l-xl">No</th>
                                                        <th className="px-4 py-2">Wallet</th>
                                                        <th className="px-4 py-2">Username</th>
                                                        <th className="px-4 py-2">Credit</th>
                                                        <th className="px-4 py-2">Birth</th>
                                                        <th className="px-4 py-2">Avatar</th>
                                                        <th className="px-4 py-2 rounded-r-xl">Chat</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map((user, idx) => (
                                                        <tr key={user.id || idx} className="bg-gray-800/80 hover:bg-purple-900/20 transition-all">
                                                            <td className="px-4 py-2">{idx + 1}</td>
                                                            <td className="px-4 py-2 font-mono break-all">{user.wallet_address}</td>
                                                            <td className="px-4 py-2">{user.user_name}</td>
                                                            <td className="px-4 py-2">{user.credit_balance}</td>
                                                            <td className="px-4 py-2 max-w-[120px] truncate whitespace-nowrap" title={user.user_birth}>{user.user_birth}</td>
                                                            <td className="px-4 py-2">
                                                                {user.avatar_url ? (
                                                                    <img src={user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full border border-purple-400 shadow" />
                                                                ) : (
                                                                    <span className="text-gray-500">-</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2 min-w-[180px]">
                                                                <div className="flex flex-wrap gap-2 justify-center md:justify-center w-[130px] m-auto">
                                                                    <button
                                                                        className="cursor-pointer px-3 py-1 rounded-lg bg-blue-500 text-white text-xs font-bold shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-all"
                                                                        onClick={() => setEditUser(user)}
                                                                    >Edit</button>
                                                                    <button
                                                                        className="cursor-pointer px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-bold shadow hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition-all"
                                                                        onClick={() => setDeleteUserId(user.id)}
                                                                    >Delete</button>
                                                                    <button
                                                                        className="cursor-pointer w-[120px] px-3 py-1 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-xs shadow hover:scale-105 focus:ring-2 focus:ring-purple-300 transition-all"
                                                                        onClick={() => { setActiveTab("Chat History"); setSelectedUser(user); }}
                                                                    >View Chat</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === "Chat History" && (
                                <div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                        <div className="flex-1">
                                            {selectedUser ? (
                                                <div className="text-purple-300 font-semibold">Chat history for <span className="font-mono">{selectedUser.wallet_address}</span></div>
                                            ) : (
                                                <div className="text-purple-300 font-semibold">All chat history</div>
                                            )}
                                        </div>
                                        {selectedUser && (
                                            <button
                                                className="cursor-pointer px-4 py-2 rounded bg-gray-800 text-purple-200 font-bold text-xs shadow hover:bg-purple-900/40 transition-all"
                                                onClick={() => setSelectedUser(null)}
                                            >
                                                Show All
                                            </button>
                                        )}
                                    </div>
                                    {chatLoading ? (
                                        <div className="text-center text-purple-300 py-8">Loading chat history...</div>
                                    ) : chatError ? (
                                        <div className="text-center text-red-400 py-8">{chatError}</div>
                                    ) : (
                                        <div className="overflow-x-auto animate-fade-in">
                                            <table className="min-w-full text-sm md:text-base border-separate border-spacing-y-2 text-center">
                                                <thead>
                                                    <tr className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 text-purple-200">
                                                        <th className="px-4 py-2 rounded-l-xl">Date</th>
                                                        <th className="px-4 py-2">Wallet</th>
                                                        <th className="px-4 py-2">Input</th>
                                                        <th className="px-4 py-2">Output</th>
                                                        <th className="px-4 py-2 rounded-r-xl">ID</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {chatHistory.map((msg, idx) => (
                                                        <tr key={msg.id || idx} className="bg-gray-800/80 hover:bg-purple-900/20 transition-all">
                                                            <td className="px-4 py-2 font-mono whitespace-nowrap">{msg.date}</td>
                                                            <td className="px-4 py-2 font-mono break-all">{msg.wallet}</td>
                                                            <td className="px-4 py-2 max-w-xs truncate cursor-pointer hover:underline text-blue-300" title={msg.input} onClick={() => setViewDetail({ field: 'input', value: msg.input })}>{msg.input}</td>
                                                            <td className="px-4 py-2 max-w-xs truncate cursor-pointer hover:underline text-purple-300" title={msg.output} onClick={() => setViewDetail({ field: 'output', value: msg.output })}>{msg.output}</td>
                                                            <td className="px-4 py-2 min-w-[140px]">
                                                                <div className="flex flex-wrap gap-2 justify-center md:justify-center w-[130px] m-auto">
                                                                    <button
                                                                        className="cursor-pointer px-3 py-1 rounded-lg bg-blue-500 text-white text-xs font-bold shadow hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-all"
                                                                        onClick={() => setEditChat(msg)}
                                                                    >Edit</button>
                                                                    <button
                                                                        className="cursor-pointer px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-bold shadow hover:bg-red-600 focus:ring-2 focus:ring-red-300 transition-all"
                                                                        onClick={() => setDeleteChatId(msg.id)}
                                                                    >Delete</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === "Credit Pricing" && (
                                <div className="flex animate-fade-in flex-col md:flex-row gap-8 justify-center items-start w-full">
                                    {/* Credit Pricing Control */}
                                    <form onSubmit={handleCreditPriceUpdate} className="flex-1 flex flex-col gap-4 bg-gray-900/80 rounded-2xl p-6 shadow border border-purple-900/30 max-w-md mx-auto">
                                        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Credit Pricing</h3>
                                        <label className="font-semibold text-purple-200">Current Price:</label>
                                        <div className="text-2xl font-extrabold text-purple-300 mb-2">{creditPriceLoading ? '...' : creditPrice}</div>
                                        <input
                                            type="number"
                                            min="1"
                                            value={creditPriceInput}
                                            onChange={e => setCreditPriceInput(e.target.value)}
                                            className="px-4 py-2 rounded-xl bg-gray-800 text-white border border-purple-900/40 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm text-lg"
                                            disabled={creditPriceLoading}
                                        />
                                        <button
                                            type="submit"
                                            className="px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 text-white text-lg bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 cursor-pointer ring-1 ring-inset ring-purple-400/20 hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                                            disabled={creditPriceLoading}
                                        >
                                            {creditPriceLoading ? 'Saving...' : 'Update Price'}
                                        </button>
                                        {creditPriceError && <div className="text-red-400 font-semibold text-center">{creditPriceError}</div>}
                                        {creditPriceSuccess && <div className="text-green-400 font-semibold text-center">{creditPriceSuccess}</div>}
                                    </form>
                                    {/* Change Password Control */}
                                    <form onSubmit={handleChangePassword} className="flex-1 flex flex-col gap-4 bg-gray-900/80 rounded-2xl p-6 shadow border border-purple-900/30 max-w-md mx-auto">
                                        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Change Admin Password</h3>
                                        <label className="font-semibold text-purple-200">Current Password</label>
                                        <input
                                            type="password"
                                            value={oldPassword}
                                            onChange={e => setOldPassword(e.target.value)}
                                            className="px-4 py-2 rounded-xl bg-gray-800 text-white border border-purple-900/40 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm text-lg"
                                            disabled={changePassLoading}
                                        />
                                        <label className="font-semibold text-purple-200">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            className="px-4 py-2 rounded-xl bg-gray-800 text-white border border-purple-900/40 focus:ring-2 focus:ring-purple-400/40 outline-none transition-all duration-150 shadow-sm text-lg"
                                            disabled={changePassLoading}
                                        />
                                        <button
                                            type="submit"
                                            className="px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 text-white text-lg bg-gradient-to-r from-purple-500 via-blue-500 to-gray-800 hover:from-purple-600 hover:to-blue-700 focus:ring-2 focus:ring-purple-300/30 cursor-pointer ring-1 ring-inset ring-purple-400/20 hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                                            disabled={changePassLoading}
                                        >
                                            {changePassLoading ? 'Saving...' : 'Change Password'}
                                        </button>
                                        {changePassError && <div className="text-red-400 font-semibold text-center">{changePassError}</div>}
                                        {changePassSuccess && <div className="text-green-400 font-semibold text-center">{changePassSuccess}</div>}
                                    </form>
                                </div>
                            )}
                            {activeTab === "Change Password" && (
                                <div className="text-center text-purple-200">Change password form will go here.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* --- User Edit Modal --- */}
            {editUser && (
                <div className="fixed animate-fade-in inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-purple-900/40">
                        <h2 className="text-xl font-bold mb-4 text-purple-300">Edit User</h2>
                        <div className="flex flex-col gap-3">
                            <label className="text-purple-200 font-semibold">Username</label>
                            <input type="text" value={editUser.user_name} onChange={e => setEditUser({ ...editUser, user_name: e.target.value })} className="px-3 py-2 rounded bg-gray-800 text-white" />
                            <label className="text-purple-200 font-semibold">Birth</label>
                            <input type="date" value={editUser.user_birth} onChange={e => setEditUser({ ...editUser, user_birth: e.target.value })} className="px-3 py-2 rounded bg-gray-800 text-white" />
                            <label className="text-purple-200 font-semibold">Credit</label>
                            <input type="number" value={editUser.credit_balance} onChange={e => setEditUser({ ...editUser, credit_balance: Number(e.target.value) })} className="px-3 py-2 rounded bg-gray-800 text-white" />
                            <label className="text-purple-200 font-semibold">Avatar URL</label>
                            <input type="text" value={editUser.avatar_url || ''} onChange={e => setEditUser({ ...editUser, avatar_url: e.target.value })} className="px-3 py-2 rounded bg-gray-800 text-white" />
                        </div>
                        {editUserError && <div className="text-red-400 font-semibold mt-2">{editUserError}</div>}
                        <div className="flex gap-4 mt-6">
                            <button className="flex-1 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow hover:scale-105 transition-all disabled:opacity-60" onClick={handleUserEditSave} disabled={editUserLoading}>{editUserLoading ? 'Saving...' : 'Save'}</button>
                            <button className="flex-1 px-4 py-2 rounded bg-gray-700 text-purple-200 font-bold shadow hover:bg-gray-800 transition-all" onClick={() => setEditUser(null)} disabled={editUserLoading}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- User Delete Confirm --- */}
            {deleteUserId && (
                <div className="fixed animate-fade-in inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-purple-900/40 text-center">
                        <h2 className="text-xl font-bold mb-4 text-red-400">Delete User?</h2>
                        <p className="mb-6 text-purple-200">Are you sure you want to delete this user? This cannot be undone.</p>
                        {deleteUserError && <div className="text-red-400 font-semibold mb-2">{deleteUserError}</div>}
                        <div className="flex gap-4">
                            <button className="flex-1 px-4 py-2 rounded bg-red-500 text-white font-bold shadow hover:bg-red-600 transition-all disabled:opacity-60" onClick={handleUserDelete} disabled={deleteUserLoading}>{deleteUserLoading ? 'Deleting...' : 'Delete'}</button>
                            <button className="flex-1 px-4 py-2 rounded bg-gray-700 text-purple-200 font-bold shadow hover:bg-gray-800 transition-all" onClick={() => setDeleteUserId(null)} disabled={deleteUserLoading}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- Chat Edit Modal --- */}
            {editChat && (
                <div className="fixed animate-fade-in inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-purple-900/40">
                        <h2 className="text-xl font-bold mb-4 text-purple-300">Edit Chat</h2>
                        <div className="flex flex-col gap-3">
                            <label className="text-purple-200 font-semibold">Input</label>
                            <textarea value={editChat.input} onChange={e => setEditChat({ ...editChat, input: e.target.value })} className="px-3 py-2 rounded bg-gray-800 text-white min-h-[60px]" />
                            <label className="text-purple-200 font-semibold">Output</label>
                            <textarea value={editChat.output} onChange={e => setEditChat({ ...editChat, output: e.target.value })} className="px-3 py-2 rounded bg-gray-800 text-white min-h-[60px]" />
                        </div>
                        {editChatError && <div className="text-red-400 font-semibold mt-2">{editChatError}</div>}
                        <div className="flex gap-4 mt-6">
                            <button className="flex-1 px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow hover:scale-105 transition-all disabled:opacity-60" onClick={handleChatEditSave} disabled={editChatLoading}>{editChatLoading ? 'Saving...' : 'Save'}</button>
                            <button className="flex-1 px-4 py-2 rounded bg-gray-700 text-purple-200 font-bold shadow hover:bg-gray-800 transition-all" onClick={() => setEditChat(null)} disabled={editChatLoading}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- Chat Delete Confirm --- */}
            {deleteChatId && (
                <div className="fixed animate-fade-in inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-purple-900/40 text-center">
                        <h2 className="text-xl font-bold mb-4 text-red-400">Delete Chat?</h2>
                        <p className="mb-6 text-purple-200">Are you sure you want to delete this chat entry? This cannot be undone.</p>
                        {deleteChatError && <div className="text-red-400 font-semibold mb-2">{deleteChatError}</div>}
                        <div className="flex gap-4">
                            <button className="flex-1 px-4 py-2 rounded bg-red-500 text-white font-bold shadow hover:bg-red-600 transition-all disabled:opacity-60" onClick={handleChatDelete} disabled={deleteChatLoading}>{deleteChatLoading ? 'Deleting...' : 'Delete'}</button>
                            <button className="flex-1 px-4 py-2 rounded bg-gray-700 text-purple-200 font-bold shadow hover:bg-gray-800 transition-all" onClick={() => setDeleteChatId(null)} disabled={deleteChatLoading}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- View Chat Input/Output Details Modal --- */}
            {viewDetail && (
                <div className="fixed animate-fade-in inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-purple-900/40">
                        <h2 className="text-xl font-bold mb-4 text-purple-300">{viewDetail.field === 'input' ? 'Chat Input' : 'Chat Output'} Details</h2>
                        <div className="bg-gray-800 text-white rounded-lg p-4 whitespace-pre-wrap break-words max-h-[60vh] overflow-auto">
                            {viewDetail.value}
                        </div>
                        <div className="flex gap-4 mt-6 justify-end">
                            <button className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold shadow hover:scale-105 transition-all" onClick={() => setViewDetail(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
        </div>
    );
}