package com.github.orhan.bottomnavigation.widget;

import com.facebook.react.views.view.ReactViewGroup;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.MotionEvent;

import javax.annotation.Nonnull;

/**
 * Touchable view, for listening to touch events, but not intercept them.
 */
@SuppressLint("ViewConstructor")
public class BNTouchableView extends ReactViewGroup {
    @Nonnull
    private final OnTouchListener onTouchListener;

    public BNTouchableView(Context context,
                       @Nonnull OnTouchListener onTouchListener) {
        super(context);
        this.onTouchListener = onTouchListener;
    }

    @Override
    public boolean onTouchEvent(MotionEvent ev) {
        return this.onTouchListener.onTouch(this, ev);
    }
}
