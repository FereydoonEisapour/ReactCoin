const Footer = () => {
    return (
        <footer
            className="footer  d-flex flex-wrap justify-content-between align-items-center py-3 border-top p-4 "
        >
            <div className="col-md-4 d-flex align-items-center">
                <a
                    href="/"
                    className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
                >
                    <svg className="bi" width="30" height="24">
                        <use xlinkHref="#bootstrap"></use>
                    </svg>
                </a>
                <span className="mb-3 mb-md-0  fw-bold">© 2022 React Coin </span>
            </div>
            <div className="px-4">
                <a href="https://github.com/FereydoonEisapour">
                    <img className="coin-img" src="https://cdn-icons-png.flaticon.com/512/25/25231.png?w=360" alt="" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
