import { PageProps } from "../App";
import { AuthContext } from "./Signin";

type Props = PageProps & {
    auth: AuthContext
};

function HomeMenu({ setPage, auth }: Props) {
    return (
        <>
        Hello, {auth.name}
        <div></div>
        <button onClick={() => setPage("track")}>Track Workout</button>
        </>
    );
}

export default HomeMenu;