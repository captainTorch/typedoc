import { Reflection, TraverseCallback, TraverseProperty } from "./abstract";
import type { ReflectionCategory } from "../ReflectionCategory";
import type { ReflectionGroup } from "../ReflectionGroup";
import type { DeclarationReflection } from "./declaration";
import type { ReflectionKind } from "./kind";
import type { Serializer, JSONOutput } from "../../serialization";

export class ContainerReflection extends Reflection {
    /**
     * The children of this reflection.
     */
    children?: DeclarationReflection[];

    /**
     * All children grouped by their kind.
     */
    groups?: ReflectionGroup[];

    /**
     * All children grouped by their category.
     */
    categories?: ReflectionCategory[];

    /**
     * A precomputed boost derived from the searchCategoryBoosts and searchGroupBoosts options, used when
     * boosting search relevance scores at runtime. May be modified by plugins.
     */
    relevanceBoost?: number;

    /**
     * Return a list of all children of a certain kind.
     *
     * @param kind  The desired kind of children.
     * @returns     An array containing all children with the desired kind.
     */
    getChildrenByKind(kind: ReflectionKind): DeclarationReflection[] {
        return (this.children || []).filter((child) => child.kindOf(kind));
    }

    /**
     * Traverse all potential child reflections of this reflection.
     *
     * The given callback will be invoked for all children, signatures and type parameters
     * attached to this reflection.
     *
     * @param callback  The callback function that should be applied for each child reflection.
     */
    override traverse(callback: TraverseCallback) {
        for (const child of this.children?.slice() || []) {
            if (callback(child, TraverseProperty.Children) === false) {
                return;
            }
        }
    }

    override toObject(serializer: Serializer): JSONOutput.ContainerReflection {
        return {
            ...super.toObject(serializer),
            children: serializer.toObjectsOptional(this.children),
            groups: serializer.toObjectsOptional(this.groups),
            categories: serializer.toObjectsOptional(this.categories),
            sources: serializer.toObjectsOptional(this.sources),
        };
    }
}
