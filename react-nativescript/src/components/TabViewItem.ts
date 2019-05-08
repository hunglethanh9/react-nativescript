import * as React from "react";
import * as ReactNativeScript from "../client/ReactNativeScript";
import { TabViewItemProps, ViewBaseProps, PropsWithoutForwardedRef } from "../shared/NativeScriptComponentTypings";
import { View, ViewBase, StackLayout, Color, ContentView, Label } from "../client/ElementRegistry";
import { TabView as NativeScriptTabView, TabViewItem as NativeScriptTabViewItem } from "tns-core-modules/ui/tab-view/tab-view";
import { ViewBaseComponentProps, RCTViewBase } from "./ViewBase";

interface Props {
    identifier: string,

    // view: View
}

export type TabViewItemComponentProps<E extends NativeScriptTabViewItem = NativeScriptTabViewItem> = Props /* & typeof RCTTabViewItem.defaultProps */ & Partial<TabViewItemProps> & ViewBaseComponentProps<E>;

/**
 * A React wrapper around the NativeScript TabViewItem component.
 * 
 * Renders the child passed into it into a StackLayout, via a React Portal.
 * 
 * See: ui/tab-view/tab-view
 * See: https://github.com/NativeScript/nativescript-sdk-examples-js/blob/master/app/ns-ui-widgets-category/tab-view/code-behind/code-behind-ts-page.ts
 */
export class _TabViewItem<P extends TabViewItemComponentProps<E>, S extends {}, E extends NativeScriptTabViewItem> extends RCTViewBase<P, S, E> {
    private readonly container = new StackLayout();

    render(){
        const {
            forwardedRef,

            onPropertyChange,

            children,
            identifier,
            // view, /* We disallow this at the typings level. */
            ...rest
        } = this.props;

        if(Array.isArray(children) || typeof children === "string" || typeof children === "number"){
            throw new Error(`'children' property passed into TabViewItem must be a single child node, which must not be a number or string`);
        }

        return React.createElement(
            'tabViewItem',
            {
                ...rest,
                view: this.container,
                ref: forwardedRef || this.myRef
            },
            ReactNativeScript.createPortal(
                children,
                this.container,
                identifier
            )
        );
    }   
}

type OwnPropsWithoutForwardedRef = PropsWithoutForwardedRef<TabViewItemComponentProps<NativeScriptTabViewItem>>;

export const TabViewItem: React.ComponentType<OwnPropsWithoutForwardedRef & React.ClassAttributes<NativeScriptTabViewItem>> = React.forwardRef<NativeScriptTabViewItem, OwnPropsWithoutForwardedRef>(
    (props: React.PropsWithChildren<OwnPropsWithoutForwardedRef>, ref: React.RefObject<NativeScriptTabViewItem>) => {
        const { children, ...rest } = props;

        return React.createElement(
            _TabViewItem,
            {
                ...rest,
                forwardedRef: ref,
            },
            children
        );
    }
)