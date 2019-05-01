import * as React from "react";
import { ViewBaseProps } from "../shared/NativeScriptComponentTypings";
import { View as NativeScriptView, ShownModallyData } from "tns-core-modules/ui/core/view/view";
import { EventData } from "tns-core-modules/data/observable/observable";
import { GestureEventData, GestureTypes, TouchGestureEventData, SwipeGestureEventData, RotationGestureEventData, PinchGestureEventData, PanGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { ViewBaseComponentProps, RCTViewBase } from "./ViewBase";
import { updateListener } from "../client/EventHandling";
import { shallowEqual } from "src/client/shallowEqual";

interface Props {
    /* From View. */
    onLoaded?: (args: EventData) => void;
    onUnloaded?: (args: EventData) => void;
    onAndroidBackPressed?: (args: EventData) => void;
    onShowingModally?: (args: ShownModallyData) => void;
    onShownModally?: (args: ShownModallyData) => void;

    /* The gesture handlers. */
    onTap?: (args: GestureEventData) => void;
    onDoubleTap?: (args: GestureEventData) => void;
    onPinch?: (args: PinchGestureEventData) => void;
    onPan?: (args: PanGestureEventData) => void;
    onSwipe?: (args: SwipeGestureEventData) => void;
    onRotation?: (args: RotationGestureEventData) => void;
    onLongPress?: (args: GestureEventData) => void;
    onTouch?: (args: TouchGestureEventData) => void;

    /* These are to be overridden in subclasses of View, so unlikely to be appropriate. */
    // onLayout?: (left: number, top: number, right: number, bottom: number) => void;
    // onMeasure?: (widthMeasureSpec: number, heightMeasureSpec: number) => void;
}

export type ViewComponentProps = Props & Partial<ViewBaseProps> & ViewBaseComponentProps;

export abstract class RCTView<P extends ViewComponentProps, S extends {}, E extends NativeScriptView> extends RCTViewBase<P, S, E> {
    /**
     * 
     * @param attach true: attach; false: detach; null: update
     */
    protected updateListeners(attach: boolean|null, nextProps?: P): void {
        super.updateListeners(attach, nextProps);

        const node: E|null = this.myRef.current;
        if(node){
            if(attach === null){
                updateListener(node, "loaded", this.props.onLoaded, nextProps.onLoaded);
                updateListener(node, "unloaded", this.props.onUnloaded, nextProps.onUnloaded);
                updateListener(node, "androidBackPressed", this.props.onAndroidBackPressed, nextProps.onAndroidBackPressed);
                updateListener(node, "showingModally", this.props.onShowingModally, nextProps.onShowingModally);
                updateListener(node, "shownModally", this.props.onShownModally, nextProps.onShownModally);
                updateListener(node, GestureTypes.tap, this.props.onTap, nextProps.onTap);
                updateListener(node, GestureTypes.doubleTap, this.props.onDoubleTap, nextProps.onDoubleTap);
                updateListener(node, GestureTypes.pinch, this.props.onPinch, nextProps.onPinch);
                updateListener(node, GestureTypes.pan, this.props.onPan, nextProps.onPan);
                updateListener(node, GestureTypes.swipe, this.props.onSwipe, nextProps.onSwipe);
                updateListener(node, GestureTypes.rotation, this.props.onRotation, nextProps.onRotation);
                updateListener(node, GestureTypes.longPress, this.props.onLongPress, nextProps.onLongPress);
                updateListener(node, GestureTypes.touch, this.props.onTouch, nextProps.onTouch);
            } else {
                const method = (attach ? node.on : node.off).bind(node);
                if(this.props.onLoaded) method("loaded", this.props.onLoaded);
                if(this.props.onUnloaded) method("unloaded", this.props.onUnloaded);
                if(this.props.onAndroidBackPressed) method("androidBackPressed", this.props.onAndroidBackPressed);
                if(this.props.onShowingModally) method("showingModally", this.props.onShowingModally);
                if(this.props.onShownModally) method("shownModally", this.props.onShownModally);
                if(this.props.onTap) method(GestureTypes.tap, this.props.onTap);
                if(this.props.onDoubleTap) method(GestureTypes.doubleTap, this.props.onDoubleTap);
                if(this.props.onPinch) method(GestureTypes.pinch, this.props.onPinch);
                if(this.props.onPan) method(GestureTypes.pan, this.props.onPan);
                if(this.props.onSwipe) method(GestureTypes.swipe, this.props.onSwipe);
                if(this.props.onRotation) method(GestureTypes.rotation, this.props.onRotation);
                if(this.props.onLongPress) method(GestureTypes.longPress, this.props.onLongPress);
                if(this.props.onTouch) method(GestureTypes.touch, this.props.onTouch);
            }
        } else {
            console.warn(`React ref to NativeScript View lost, so unable to update event listeners.`);
        }
    }

    abstract render(): React.ReactNode;
}