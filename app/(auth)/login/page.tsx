import LoginForm from "./components/LoginForm";

export const metadata = {
	title: "Войти - blog",
};

const LoginPage = () => {
	return (
		<main className="min-h-screen flex justify-center items-center">
			<div className="flex flex-col gap-4 w-full px-4 md:max-w-[384px]">
				<h1 className="font-bold text-2xl tracking-tight">Войти в аккаунт</h1>
				<LoginForm />
			</div>
		</main>
	);
};

export default LoginPage;
