// src/components/Header.tsx
/*import React from 'react';
import { User } from '../types';

// Սահմանում ենք էջի տեսակը, որպեսզի ճիշտ փոխանցենք App.tsx-ին
type Page = 'products' | 'cart' | 'auth' | 'admin';

interface HeaderProps {
    currentUser: User | null;
    cartItemCount: number;
    onLogout: () => void;
    onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, cartItemCount, onLogout, onNavigate }) => {
    return (
        <header className="app-header">
            <div className="logo" onClick={() => onNavigate('products')}>
                <h1>Cosmetic Shop</h1>
            </div>

            <nav className="main-nav">
                <button onClick={() => onNavigate('products')}>Ապրանքներ</button>
                
                <button onClick={() => onNavigate('cart')}>
                    Զամբյուղ ({cartItemCount})
                </button>

                {currentUser && currentUser.isAdmin && (
                    <button onClick={() => onNavigate('admin')}>Ադմին Վահանակ</button>
                )}
            </nav>

            <div className="user-info">
                {currentUser ? (
                    <>
                        <span className="user-email">
                            Բարև, {currentUser.email} {currentUser.isAdmin ? '(Admin)' : ''}
                        </span>
                        <button onClick={onLogout} className="btn-logout">
                            Ելք
                        </button>
                    </>
                ) : (
                    <button onClick={() => onNavigate('auth')} className="btn-login">
                        Մուտք/Գրանցում
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;*/

// src/components/Header.tsx
/*import React from 'react';
import { User } from '../types';
import { Page } from '../App'; // << Իմպորտ Page-ը App.tsx-ից

interface HeaderProps {
    currentUser: User | null;
    cartItemCount: number;
    onLogout: () => void;
    // Թարմացված տիպը, որը համապատասխանում է App-ի setCurrentPage-ին
    onNavigate: React.Dispatch<React.SetStateAction<Page>>; 
}

const Header: React.FC<HeaderProps> = ({ currentUser, cartItemCount, onLogout, onNavigate }) => {
    return (
        <header className="app-header">
            <div className="logo" onClick={() => onNavigate('products')}>
                <h1>Cosmetic Shop</h1>
            </div>

            <nav className="main-nav">
                <button onClick={() => onNavigate('products')}>Ապրանքներ</button>
                
                <button onClick={() => onNavigate('cart')}>
                    Զամբյուղ ({cartItemCount})
                </button>

                {currentUser && currentUser.isAdmin && (
                    <button onClick={() => onNavigate('admin')}>Ադմին Վահանակ</button>
                )}
            </nav>

            <div className="user-info">
                {currentUser ? (
                    <>
                        <span className="user-email">
                            Բարև, {currentUser.email} {currentUser.isAdmin ? '(Admin)' : ''}
                        </span>
                        <button onClick={onLogout} className="btn-logout">
                            Ելք
                        </button>
                    </>
                ) : (
                    <button onClick={() => onNavigate('auth')} className="btn-login">
                        Մուտք/Գրանցում
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;*/