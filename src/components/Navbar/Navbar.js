import './Navbar.scss';
import logo from '../../assets/logo_reda_ben_wadi.png';

const Navbar = ({ showSignUpModal }) => {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid bd-highlight px-5">
                <img src={logo} alt="logo" />
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav w-100 d-flex flex-row-reverse">
                        <li className="nav-item">
                                <button className="nav-link" onClick={showSignUpModal}>تسجيل الدخول</button>
                        </li>
                        <li className="nav-item">
                                <button className="nav-link">تواصل معنا</button>
                        </li>
                        <li className="nav-item">
                                <button className="nav-link">دليل الإستخدام</button>
                        </li>
                        <li className="nav-item me-4">
                            <button className="nav-link">الرئيسية</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
      );
};

export default Navbar;