<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RecordServiceController extends Controller
{
    private string $baseUrl;
    private string $secret;

    public function __construct()
    {
        $this->baseUrl = env('RECORDS_SERVICE_URL') . '/api/records';
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

    public function show(int $id)
    {
        $response = $this->http()->get("{$this->baseUrl}/{$id}");
        return response($response->body(), $response->status());
    }

    public function byPatient(int $patient_id)
    {
        $response = $this->http()->get("{$this->baseUrl}/patient/{$patient_id}");
        return response($response->body(), $response->status());
    }

    public function store(Request $request)
    {
        $response = $this->http()->post($this->baseUrl, $request->all());
        return response($response->body(), $response->status());
    }

    public function update(Request $request, int $id)
    {
        $response = $this->http()->put("{$this->baseUrl}/{$id}", $request->all());
        return response($response->body(), $response->status());
    }

    public function destroy(int $id)
    {
        $response = $this->http()->delete("{$this->baseUrl}/{$id}");
        return response($response->body(), $response->status());
    }
}