import type { UmbRelationTypeDetailModel } from '../../types.js';
import { UMB_RELATION_TYPE_ENTITY_TYPE } from '../../entity.js';
import { RelationTypeResource } from '@umbraco-cms/backoffice/external/backend-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { tryExecuteAndNotify } from '@umbraco-cms/backoffice/resources';

/**
 * A data source for the Relation Type that fetches data from the server
 * @export
 * @class UmbRelationTypeServerDataSource
 * @implements {RepositoryDetailDataSource}
 */
export class UmbRelationTypeServerDataSource implements UmbReadDataSource<UmbRelationTypeDetailModel> {
	#host: UmbControllerHost;

	/**
	 * Creates an instance of UmbRelationTypeServerDataSource.
	 * @param {UmbControllerHost} host
	 * @memberof UmbRelationTypeServerDataSource
	 */
	constructor(host: UmbControllerHost) {
		this.#host = host;
	}

	/**
	 * Fetches a Relation Type with the given id from the server
	 * @param {string} unique
	 * @return {*}
	 * @memberof UmbRelationTypeServerDataSource
	 */
	async read(unique: string) {
		if (!unique) throw new Error('Unique is missing');

		const { data, error } = await tryExecuteAndNotify(
			this.#host,
			RelationTypeResource.getRelationTypeById({ id: unique }),
		);

		if (error || !data) {
			return { error };
		}

		// TODO: make data mapper to prevent errors
		const relationType: UmbRelationTypeDetailModel = {
			alias: data.alias || '',
			child:
				data.childObjectType && data.childObjectTypeName
					? {
							objectType: {
								unique: data.childObjectType,
								name: data.childObjectTypeName,
							},
						}
					: null,
			entityType: UMB_RELATION_TYPE_ENTITY_TYPE,
			isBidirectional: data.isBidirectional,
			isDeletable: data.isDeletable,
			isDependency: data.isDependency,
			name: data.name,
			parent:
				data.childObjectType && data.childObjectTypeName
					? {
							objectType: {
								unique: data.childObjectType,
								name: data.childObjectTypeName,
							},
						}
					: null,
			unique: data.id,
		};

		return { data: relationType };
	}
}
