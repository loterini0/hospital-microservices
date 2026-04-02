<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NotificationServiceController extends Controller
{
    private string $baseUrl;
    private string $secret;

    public function __construct()
    {
        $this->baseUrl = env('NOTIFICATIONS_SERVICE_URL') . '/api/notifications';
        $this->secret  = env('GATEWAY_SECRET');
    }

    private function http()
    {
        return Http::withHeaders([
            'X-Gateway-Secret' => $this->secret,
            'Content-Type'     => 'application/json',
        ]);
    }

    public function index()
    {
        $response = $this->http()->get($this->baseUrl);
        return response($response->body(), $response->status());
    }

    public function byUser(int $user_id)
    {
        $response = $this->http()->get("{$this->baseUrl}/user/{$user_id}");
        return response($response->body(), $response->status());
    }

    public function store(Request $request)
    {
        $response = $this->http()->post($this->baseUrl, $request->all());
        return response($response->body(), $response->status());
    }

    public function markAsRead(string $id)
    {
        $response = $this->http()->put("{$this->baseUrl}/{$id}/read");
        return response($response->body(), $response->status());
    }

    public function destroy(string $id)
    {
        $response = $this->http()->delete("{$this->baseUrl}/{$id}");
        return response($response->body(), $response->status());
    }
}