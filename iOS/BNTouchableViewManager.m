/**
 * BNTouchableViewManager.m
 * Native component used for the Ripple effect.
 */

#import "RCTViewManager.h"
#import "RCTEventDispatcher.h"
#import "UIView+React.h"
#import "BNTouchableView.h"

@interface BNTouchableViewManager : RCTViewManager <BNTouchableViewDelegate>
@end

@implementation BNTouchableViewManager

RCT_EXPORT_MODULE()

- (UIView*)view
{
    BNTouchableView *view = [[BNTouchableView alloc] init];
    view.delegate = self;
    return view;
}

#pragma mark - BNTouchableViewDelegate

- (void)BNTouchable:(BNTouchableView *)view touchesBegan:(UITouch *)touch
{
    [self sendTouchEvent:@"TOUCH_DOWN" touch:touch source:view];
}

- (void)BNTouchable:(BNTouchableView *)view touchesMoved:(UITouch *)touch
{
    [self sendTouchEvent:@"TOUCH_MOVE" touch:touch source:view];
}

- (void)BNTouchable:(BNTouchableView *)view touchesEnded:(UITouch *)touch
{
    [self sendTouchEvent:@"TOUCH_UP" touch:touch source:view];
}

- (void)BNTouchable:(BNTouchableView *)view touchesCancelled:(UITouch *)touch
{
    [self sendTouchEvent:@"TOUCH_CANCEL" touch:touch source:view];
}

- (void)sendTouchEvent:(NSString*)type touch:(UITouch*)touch source:(BNTouchableView*)source
{
    CGPoint location = [touch locationInView:source];
    NSDictionary *dict = @{
                           @"target": source.reactTag,
                           @"type": type,
                           @"x": [NSNumber numberWithFloat:location.x],
                           @"y": [NSNumber numberWithFloat:location.y],
                           };
    [self.bridge.eventDispatcher sendInputEventWithName:@"topChange" body:dict];
}

@end
