import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UMB_BLOCK_GRID_MANAGER_CONTEXT } from '../../context/block-grid-manager.context.js';
import { UMB_BLOCK_GRID_ENTRY_CONTEXT, type UmbBlockGridLayoutAreaItemModel } from '@umbraco-cms/backoffice/block';
import { css, customElement, html, repeat, state } from '@umbraco-cms/backoffice/external/lit';

import '../block-grid-entries/index.js';
/**
 * @element umb-block-grid-area-container
 */
@customElement('umb-block-grid-area-container')
export class UmbBlockGridAreaContainerElement extends UmbLitElement {
	//
	#styleElement?: HTMLLinkElement;

	@state()
	_areas?: Array<UmbBlockGridLayoutAreaItemModel> = [];

	constructor() {
		super();

		this.consumeContext(UMB_BLOCK_GRID_ENTRY_CONTEXT, (context) => {
			this.observe(
				context.areas,
				(areas) => {
					this._areas = areas;
				},
				'observeAreas',
			);
		});
		this.consumeContext(UMB_BLOCK_GRID_MANAGER_CONTEXT, (manager) => {
			this.observe(
				manager.layoutStylesheet,
				(stylesheet) => {
					this.#styleElement = document.createElement('link');
					this.#styleElement.setAttribute('rel', 'stylesheet');
					this.#styleElement.setAttribute('href', stylesheet);
				},
				'observeStylesheet',
			);
		});
	}

	render() {
		return this._areas
			? html` ${this.#styleElement}
					<div class="umb-block-grid__layout-container">
						${repeat(
							this._areas,
							(area) => area.key,
							(area) => html` <umb-block-grid-entries .areaKey=${area.key}> </umb-block-grid-entries>`,
						)}
					</div>`
			: '';
	}

	static styles = [
		css`
			:host {
				display: block;
				width: 100%;
			}
		`,
	];
}

export default UmbBlockGridAreaContainerElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-block-grid-area-container': UmbBlockGridAreaContainerElement;
	}
}
