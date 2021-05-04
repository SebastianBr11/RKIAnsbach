package com.rkiansbach;

import android.app.Activity;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.view.Window;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

public class ColorThemeModule extends ReactContextBaseJavaModule {

    ColorThemeModule(ReactApplicationContext context) {
        super(context);
    }

    public void setNavigationBarTheme(Activity activity, Boolean light) {
        if (activity != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Window window = activity.getWindow();
            int flags = window.getDecorView().getSystemUiVisibility();
            if (light) {
                flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            } else {
                flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
            }
            window.getDecorView().setSystemUiVisibility(flags);
        }
    }

    @ReactMethod
    public void setTheme(final String color, final boolean light) {
        if (getCurrentActivity() == null) {
            Log.d("ColorThemeModule", "Current activity is null");
            return;
        }
        final Window window = getCurrentActivity().getWindow();
        System.out.println(Color.parseColor("#ffffff"));
        runOnUiThread(() -> {
            window.setNavigationBarColor(Color.parseColor(String.valueOf(color).trim()));
            setNavigationBarTheme(getCurrentActivity(), light);
        });

//        runOnUiThread(new Runnable() {
//            @Override
//            public void run() {
//                if (getCurrentActivity() != null)
//                    getCurrentActivity().recreate();
//                else
//
//            }
//        });

        Log.d("ColorThemeModule", "Changed color to " + color);
    }

    @Override
    public String getName() {
        return "ColorThemeModule";
    }
}