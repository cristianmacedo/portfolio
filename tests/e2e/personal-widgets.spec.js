import {test,expect} from "@playwright/test";
for(const width of [390,820,1440]){
 test("widget geometry and actions at "+width,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.goto("/");
  const widget=id=>page.locator('.top-grid > [data-widget-id="'+id+'"]');
  const unit=await widget("linkedin").boundingBox();
  const art=await widget("terminal").locator("img").boundingBox();
  for(const dim of ["width","height"]) expect(Math.abs(unit[dim]-art[dim])).toBeLessThan(1);
  for(const id of ["music","photos","activity","calendar","notes"]){
   const box=await widget(id).boundingBox();
   const gap = await page.locator(".top-grid").evaluate(el => parseFloat(getComputedStyle(el).columnGap));
   expect(Math.abs(box.width - (id==="notes" ? 2*box.height+gap : box.height))).toBeLessThan(1);
   await widget(id).screenshot({path:'/tmp/portfolio-'+width+'-'+id+'.png'});
  }
  for(const id of ["notes","photos"]){
   await widget(id).click();
   await expect(page.locator('.pw-window')).toBeVisible();
   await page.locator('.pw-bar button').click();
  }
 });
}
