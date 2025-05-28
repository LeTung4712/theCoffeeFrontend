// Route test thông báo
Route::post('/test-notification', function (Request $request) {
    $order = [
        'id' => rand(1000, 9999),
        'message' => $request->message ?? 'Đơn hàng test',
        'type' => $request->type ?? 'success',
        'created_at' => now()
    ];

    event(new \App\Events\NewOrderEvent($order));

    return response()->json([
        'success' => true,
        'message' => 'Đã gửi thông báo test',
        'order' => $order
    ]);
});
