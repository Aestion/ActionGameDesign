import { useState } from "react";
import {
  ee2ControlRoutes,
  ee2InteractionOutcome,
  type EE2InteractionRouteId
} from "./ee2-combat-data";

export function EE2CombatInteractionDiagram() {
  const [activeRouteId, setActiveRouteId] = useState<EE2InteractionRouteId | null>(null);
  const activeRoute = ee2ControlRoutes.find(({ id }) => id === activeRouteId) ?? null;
  const routeState = (id: EE2InteractionRouteId) => (
    activeRouteId === null ? "idle" : activeRouteId === id ? "active" : "muted"
  );

  return (
    <section
      className="ee2-section ee2-interaction"
      aria-label="招式博弈关系图"
    >
      <div className="analysis-section-heading">
        <p className="eyebrow">RELATION</p>
        <h2 id="ee2-interaction-title">招式博弈关系</h2>
      </div>
      <p className="analysis-thesis">
        玩家先读敌人当前动作，再从招式对等、主动破绽和专属弱点中选择夺权路径；三条路径都汇入同一段有限输出与可读脱离。
      </p>

      <div className="ee2-interaction-map">
        <div className="ee2-interaction-column ee2-interaction-column--player">
          <p className="ee2-interaction-label"><span>01</span> 玩家选择</p>
          {ee2ControlRoutes.map((route) => (
            <div
              className="ee2-interaction-node ee2-interaction-node--player"
              data-route={route.id}
              data-state={routeState(route.id)}
              key={route.id}
            >
              <span>{route.verb}</span>
              <strong>{route.playerAction}</strong>
            </div>
          ))}
        </div>

        <div className="ee2-interaction-column ee2-interaction-column--enemy">
          <p className="ee2-interaction-label"><span>02</span> 敌人状态</p>
          {ee2ControlRoutes.map((route) => (
            <div
              className="ee2-interaction-node ee2-interaction-node--enemy"
              data-route={route.id}
              data-state={routeState(route.id)}
              key={route.id}
            >
              <strong>{route.enemyState}</strong>
            </div>
          ))}
        </div>

        <div className="ee2-interaction-column ee2-interaction-column--routes">
          <p className="ee2-interaction-label"><span>03</span> 夺权入口</p>
          {ee2ControlRoutes.map((route) => (
            <div
              className="ee2-interaction-route-shell"
              data-route={route.id}
              data-state={routeState(route.id)}
              key={route.id}
            >
              <button
                type="button"
                className="ee2-interaction-route"
                aria-label={`${route.verb}：${route.title}`}
                aria-pressed={activeRouteId === route.id}
                onClick={() => setActiveRouteId((current) => current === route.id ? null : route.id)}
              >
                <span>{route.verb}</span>
                <strong>{route.title}</strong>
              </button>
            </div>
          ))}
        </div>

        <div className="ee2-interaction-column ee2-interaction-column--outcome">
          <p className="ee2-interaction-label"><span>04</span> 共同结果</p>
          <ol className="ee2-interaction-outcome">
            {ee2InteractionOutcome.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="ee2-interaction-detail" role="status" aria-live="polite" aria-atomic="true">
        <p className="eyebrow">当前阅读</p>
        <h3 id="ee2-interaction-detail-title">
          {activeRoute ? `${activeRoute.verb} · ${activeRoute.title}` : "完整关系"}
        </h3>
        {activeRoute ? (
          <dl>
            <div><dt>触发</dt><dd>{activeRoute.trigger}</dd></div>
            <div><dt>手段</dt><dd>{activeRoute.tools}</dd></div>
            <div><dt>收益</dt><dd>{activeRoute.reward}</dd></div>
            <div><dt>边界</dt><dd>{activeRoute.boundary}</dd></div>
          </dl>
        ) : (
          <p>
            三条路径共同回答玩家如何把敌人送入僵直，但不共享额外状态条。选择一条路径可单独阅读触发、手段、收益和边界。
          </p>
        )}
      </div>
    </section>
  );
}
