interface CKEditorComponentProps {
	setValue: (value: string) => void;
	value: string;
}

export function CKEditorComponent({ setValue, value }: CKEditorComponentProps) {
	const { CKEditor } = require("@ckeditor/ckeditor5-react");
	const ClassicEditor = require("@ckeditor/ckeditor5-build-classic");

	return (
		<CKEditor
			editor={ClassicEditor}
			data={value}
			onReady={(editor: any) => {}}
			onChange={(event: any, editor: any) => {
				const data = editor.getData();
				setValue(data);
			}}
		/>
	);
}
