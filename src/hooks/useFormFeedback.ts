import { useToast } from "@chakra-ui/react";

export interface UseFormFeedbackReturnType {
	showResponse: (message: string, status: "success" | "error" | "warning" | "info") => void;
	handleResponse: <T>(callback: () => Promise<T> | T) => Promise<T | void>;
}

export const useFormFeedback = (): UseFormFeedbackReturnType => {
	const toast = useToast();

	const showResponse = (message: string, status: "success" | "error" | "warning" | "info") => {
		toast({
			position: "top",
			title: message,
			id: "notification",
			status,
			isClosable: true,
			duration: 10000,
		});
	};

	const handleResponse = async <T>(callback: () => Promise<T> | T) => {
		try {
			return await callback();
		} catch (err: any) {
			toast({
				position: "top",
				title: err.message || "An unknown error occurred",
				id: "notification",
				status: "error",
				isClosable: true,
				duration: 10000,
			});
		}
	};

	return {
		showResponse,
		handleResponse,
	};
};
