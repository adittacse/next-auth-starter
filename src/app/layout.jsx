import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
    weight: ["200", "400", "500", "600", "700"],
});

const RootLayout = ({children}) => {
    return (
        <html className={`${poppins.className}`}>
        <body>
            {children}
        </body>
        </html>
    );
};
export default RootLayout;
