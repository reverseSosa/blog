import RegisterForm from "./components/RegisterForm";

const RegisterPage = () => {
	return (
		<main className="min-h-screen flex justify-center items-center">
			<div className="flex flex-col gap-4 w-full px-4 md:max-w-[384px]">
				<h1 className="font-bold text-2xl tracking-tight">Создать аккаунт</h1>
				<RegisterForm />
			</div>
		</main>
	);
};

export default RegisterPage;
