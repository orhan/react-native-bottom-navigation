/**
 * BNTouchableView.h
 * Native component used for the Ripple effect.
 */

#ifndef BNTouchableView_h
#define BNTouchableView_h

#import <React/RCTView.h>

@class BNTouchableView;
@protocol BNTouchableViewDelegate;

/*
 * The BNTouchable component
 */
@interface BNTouchableView : RCTView

@property (nonatomic, weak) id<BNTouchableViewDelegate> delegate;

@end

/*
 * Touche events delegate
 */
@protocol BNTouchableViewDelegate <NSObject>

@required
- (void)BNTouchable:(BNTouchableView*)view touchesBegan:(UITouch*)touch;

@required
- (void)BNTouchable:(BNTouchableView *)view touchesMoved:(UITouch *)touch;

@required
- (void)BNTouchable:(BNTouchableView *)view touchesEnded:(UITouch *)touch;

@required
- (void)BNTouchable:(BNTouchableView *)view touchesCancelled:(UITouch *)touch;

@end

#endif /* BNTouchableView_h */
