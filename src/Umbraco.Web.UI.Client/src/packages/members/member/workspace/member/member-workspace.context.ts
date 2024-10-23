import { UMB_MEMBER_DETAIL_REPOSITORY_ALIAS } from '../../repository/index.js';
import type { UmbMemberDetailModel, UmbMemberVariantModel } from '../../types.js';
import { UmbMemberPropertyDatasetContext } from '../../property-dataset-context/member-property-dataset-context.js';
import { UMB_MEMBER_ENTITY_TYPE } from '../../entity.js';
import { UMB_MEMBER_WORKSPACE_ALIAS } from './manifests.js';
import { UmbMemberWorkspaceEditorElement } from './member-workspace-editor.element.js';
import { UMB_MEMBER_DETAIL_MODEL_VARIANT_SCAFFOLD } from './constants.js';
import { UmbMemberTypeDetailRepository, type UmbMemberTypeDetailModel } from '@umbraco-cms/backoffice/member-type';
import {
	UmbWorkspaceIsNewRedirectController,
	UmbWorkspaceIsNewRedirectControllerAlias,
} from '@umbraco-cms/backoffice/workspace';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbVariantId } from '@umbraco-cms/backoffice/variant';
import { UmbContentDetailWorkspaceBase, type UmbContentWorkspaceContext } from '@umbraco-cms/backoffice/content';

type EntityModel = UmbMemberDetailModel;
export class UmbMemberWorkspaceContext
	extends UmbContentDetailWorkspaceBase<EntityModel>
	implements UmbContentWorkspaceContext<EntityModel, UmbMemberTypeDetailModel, UmbMemberVariantModel>
{
	readonly contentTypeUnique = this._data.createObservablePartOfCurrent((data) => data?.memberType.unique);
	readonly kind = this._data.createObservablePartOfCurrent((data) => data?.kind);

	constructor(host: UmbControllerHost) {
		super(host, {
			entityType: UMB_MEMBER_ENTITY_TYPE,
			workspaceAlias: UMB_MEMBER_WORKSPACE_ALIAS,
			detailRepositoryAlias: UMB_MEMBER_DETAIL_REPOSITORY_ALIAS,
			contentTypeDetailRepository: UmbMemberTypeDetailRepository,
			contentVariantScaffold: UMB_MEMBER_DETAIL_MODEL_VARIANT_SCAFFOLD,
		});

		this.observe(this.contentTypeUnique, (unique) => this.structure.loadType(unique), null);

		this.routes.setRoutes([
			{
				path: 'create/:memberTypeUnique',
				component: () => new UmbMemberWorkspaceEditorElement(),
				setup: async (_component, info) => {
					const memberTypeUnique = info.match.params.memberTypeUnique;
					this.create(memberTypeUnique);

					new UmbWorkspaceIsNewRedirectController(
						this,
						this,
						this.getHostElement().shadowRoot!.querySelector('umb-router-slot')!,
					);
				},
			},
			{
				path: 'edit/:unique',
				component: () => new UmbMemberWorkspaceEditorElement(),
				setup: (_component, info) => {
					this.removeUmbControllerByAlias(UmbWorkspaceIsNewRedirectControllerAlias);
					const unique = info.match.params.unique;
					this.load(unique);
				},
			},
		]);
	}

	override resetState() {
		super.resetState();
		this.removeUmbControllerByAlias(UmbWorkspaceIsNewRedirectControllerAlias);
	}

	async create(memberTypeUnique: string) {
		this.resetState();
		this.#getDataPromise = this.repository.createScaffold({
			memberType: {
				unique: memberTypeUnique,
			},
		});
		const { data } = await this.#getDataPromise;
		if (!data) return undefined;

		this.#entityContext.setEntityType(UMB_MEMBER_ENTITY_TYPE);
		this.#entityContext.setUnique(data.unique);
		this.setIsNew(true);
		this.#data.setPersisted(undefined);
		this.#data.setCurrent(data);
		return data;
	}

	getContentTypeId() {
		return this.getData()?.memberType.unique;
	}

	public createPropertyDatasetContext(
		host: UmbControllerHost,
		variantId: UmbVariantId,
	): UmbMemberPropertyDatasetContext {
		return new UmbMemberPropertyDatasetContext(host, this, variantId);
	}

	set<PropertyName extends keyof UmbMemberDetailModel>(
		propertyName: PropertyName,
		value: UmbMemberDetailModel[PropertyName],
	) {
		this._data.updateCurrent({ [propertyName]: value });
	}

	// Only for CRUD demonstration purposes
	updateData(data: Partial<EntityModel>) {
		const currentData = this._data.getCurrent();
		if (!currentData) throw new Error('No data to update');
		this._data.setCurrent({ ...currentData, ...data });
	}

	get email(): string {
		return this.#get('email') || '';
	}

	get username(): string {
		return this.#get('username') || '';
	}

	get isLockedOut(): boolean {
		return this.#get('isLockedOut') || false;
	}

	get isTwoFactorEnabled(): boolean {
		return this.#get('isTwoFactorEnabled') || false;
	}

	get isApproved(): boolean {
		return this.#get('isApproved') || false;
	}

	get failedPasswordAttempts(): number {
		return this.#get('failedPasswordAttempts') || 0;
	}

	get lastLockOutDate(): string | null {
		return this.#get('lastLockoutDate') ?? null;
	}

	get lastLoginDate(): string | null {
		return this.#get('lastLoginDate') ?? null;
	}

	get lastPasswordChangeDate(): string | null {
		return this.#get('lastPasswordChangeDate') ?? null;
	}

	get memberGroups() {
		return this.#get('groups') || [];
	}

	#get<PropertyName extends keyof UmbMemberDetailModel>(propertyName: PropertyName) {
		return this._data.getCurrent()?.[propertyName];
	}
}

export { UmbMemberWorkspaceContext as api };
