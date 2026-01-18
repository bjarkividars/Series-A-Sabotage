export function getWarpUrl(fundingAmount: number): string {
  const baseUrl = 'https://team-planner.onrender.com/setup';
  // const baseUrl = 'http://localhost:5173/setup';
  const params = new URLSearchParams({ funding: fundingAmount.toString() });
  return `${baseUrl}?${params.toString()}`;
}
