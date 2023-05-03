function Footer() {
  const currYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__text">© {currYear} Around The U.S.</p>
    </footer>
  );
}

export default Footer;
