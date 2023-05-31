import type { ManifestPropertyEditorModel } from '@umbraco-cms/backoffice/extension-registry';

export const manifest: ManifestPropertyEditorModel = {
	type: 'propertyEditorModel',
	name: 'JSON model',
	alias: 'Umbraco.JSON',
	meta: {
		defaultUI: 'Umb.PropertyEditorUI.JSON',
	},
};
