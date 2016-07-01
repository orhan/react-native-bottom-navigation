/**
 * BNTouchableView.m
 * Native component used for the Ripple effect.
 */

#import "BNTouchableView.h"

@implementation BNTouchableView

#pragma mark - Touch event handling

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    if (self.delegate) {
        [self.delegate BNTouchable:self touchesBegan:touch];
    }
    [super touchesBegan:touches withEvent:event];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    if (self.delegate) {
        [self.delegate BNTouchable:self touchesEnded:touch];
    }
    [super touchesEnded:touches withEvent:event];
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    if (self.delegate) {
        [self.delegate BNTouchable:self touchesMoved:touch];
    }
    [super touchesMoved:touches withEvent:event];
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    UITouch *touch = [touches anyObject];
    if (self.delegate) {
        [self.delegate BNTouchable:self touchesCancelled:touch];
    }
    [super touchesCancelled:touches withEvent:event];
}

@end
